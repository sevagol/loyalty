// pages/api/loyalty/requestMark.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import MarkRequest from '@/models/MarkRequest';
import { verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      const decoded: any = verifyToken(token);
      const userId = decoded.userId;

      const { isFreeCoffee } = req.body; // e.g. true or false
      const reqType = isFreeCoffee ? 'freeCoffee' : 'mark';

      const newRequest = await MarkRequest.create({
        userId,
        status: 'pending',
        type: reqType,
      });

      return res.status(201).json({
        message: isFreeCoffee
          ? 'Free coffee request created'
          : 'Mark request created',
        requestId: newRequest._id,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // GET -> list mark requests if needed
  if (req.method === 'GET') {
    try {
      const requests = await MarkRequest.find({ status: 'pending' })
      .populate('userId', 'name');
      return res.status(200).json(requests);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).end(); 
}
