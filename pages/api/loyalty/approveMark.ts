// pages/api/loyalty/approveMark.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import MarkRequest from '@/models/MarkRequest';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    await dbConnect();

    // Optionally, verify role === 'owner'
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);

    const { requestId, action } = req.body; // action: 'approve' or 'reject'

    const markRequest = await MarkRequest.findById(requestId);
    if (!markRequest || markRequest.status !== 'pending') {
      return res.status(404).json({ error: 'Request not found or not pending' });
    }

    if (action === 'approve') {
      markRequest.status = 'approved';
      await markRequest.save();

      // If 'approve' -> update user’s loyaltyPoints
      const user = await User.findById(markRequest.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (markRequest.type === 'freeCoffee') {
        // Reset loyalty points to 0
        user.loyaltyPoints = 0;
      } else {
        // Normal coffee mark request
        user.loyaltyPoints += 1;
      }

      await user.save();
      return res.status(200).json({ message: 'Request approved' });
    }

    if (action === 'reject') {
      markRequest.status = 'rejected';
      await markRequest.save();
      return res.status(200).json({ message: 'Request rejected' });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}
