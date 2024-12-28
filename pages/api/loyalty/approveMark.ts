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

    // In production, you should verify the user has "owner" role
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);

    // e.g. if (decoded.role !== 'owner') return res.status(403).json({ error: 'Forbidden' });

    const { requestId } = req.body;

    const markRequest = await MarkRequest.findById(requestId);
    if (!markRequest || markRequest.status !== 'pending') {
      return res.status(404).json({ error: 'Request not found or not pending' });
    }

    // Approve the request
    markRequest.status = 'approved';
    await markRequest.save();

    // Update user's loyaltyPoints
    const user = await User.findById(markRequest.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.loyaltyPoints += 1;
    if (user.loyaltyPoints >= 6) {
      // They get a free coffee, so reset or subtract 6 points
      user.loyaltyPoints -= 6;
    }

    // Referral logic: Add 2 shekels to the user who invited this user
    if (user.invitedBy) {
        const referrer = await User.findById(user.invitedBy);
        if (referrer) {
          referrer.walletBalance += 2;
          await referrer.save();
        }
      }
      

    await user.save();

    return res.status(200).json({ message: 'Mark request approved' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}
