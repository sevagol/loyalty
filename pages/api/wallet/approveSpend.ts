import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import { verifyToken } from '@/lib/auth';
import SpendRequest from '@/models/SpendRequest';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'POST') return res.status(405).end(); // Method Not Allowed

  try {
    // Verify the user is an owner
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);

    // OPTIONAL: check if decoded.role === 'owner'
    // if (decoded.role !== 'owner') {
    //   return res.status(403).json({ error: 'Forbidden' });
    // }

    const { spendRequestId, action } = req.body; // action can be "approve" or "reject"
    if (!spendRequestId || !action) {
      return res.status(400).json({ error: 'Missing spendRequestId or action' });
    }

    const spendReq = await SpendRequest.findById(spendRequestId);
    if (!spendReq || spendReq.status !== 'pending') {
      return res.status(404).json({ error: 'No pending spend request found' });
    }

    if (action === 'approve') {
      // Approve request -> subtract from user wallet
      const user = await User.findById(spendReq.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if user has enough balance
      if (user.walletBalance < spendReq.amount) {
        // Optionally reject if balance is insufficient
        spendReq.status = 'rejected';
        await spendReq.save();
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      user.walletBalance -= spendReq.amount;
      await user.save();

      spendReq.status = 'approved';
      await spendReq.save();

      return res.status(200).json({ message: 'Spending request approved' });
    } else if (action === 'reject') {
      spendReq.status = 'rejected';
      await spendReq.save();
      return res.status(200).json({ message: 'Spending request rejected' });
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}
