// pages/api/wallet/spendRequests.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import SpendRequest from '@/models/SpendRequest';
import { verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      // Optional: Check if user is an owner
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const token = authHeader.split(' ')[1];
      const decoded: any = verifyToken(token);

      // e.g. if (decoded.role !== 'owner') return res.status(403).json({ error: 'Forbidden' });
      
      // Return only pending requests or all requests as desired
      const requests = await SpendRequest.find({ status: 'pending' });
      return res.status(200).json(requests);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).end(); // Method Not Allowed
}
