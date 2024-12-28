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

      // Create pending request
      const newRequest = await MarkRequest.create({ userId, status: 'pending' });

      return res.status(201).json({ message: 'Mark request created', requestId: newRequest._id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // For Owner: GET to list all pending requests
  if (req.method === 'GET') {
    try {
      const requests = await MarkRequest.find({ status: 'pending' });
      return res.status(200).json(requests);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).end(); // Method Not Allowed
}
