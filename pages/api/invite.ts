// pages/api/invite.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Invitation from '@/models/Invitation'; // your new model
import { verifyToken } from '@/lib/auth';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    await dbConnect();

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);

    const inviter = await User.findById(decoded.userId);
    if (!inviter) {
      return res.status(404).json({ error: 'Inviter user not found' });
    }

    // The phone number of the person you want to invite
    const { phone } = req.body;

    // Generate a random code
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();

    // Create in DB
    const newInvite = await Invitation.create({
      code,
      owner: inviter._id,
    });

    return res.status(200).json({
      message: `Invite code generated. Share this code with your friend.`,
      code,
      phone,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}
