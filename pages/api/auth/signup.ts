// pages/api/auth/signup.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { hashPassword, generateToken } from '@/lib/auth';
import Invitation from '@/models/Invitation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    await dbConnect();
    const { name, phone, password, role, code } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this phone already exists.' });
    }

    const hashedPassword = await hashPassword(password);

    // If there's an invite code, verify it
    let invitedBy = null;
    if (code) {
      const invite = await Invitation.findOne({ code });
      if (!invite) {
        return res.status(400).json({ error: 'Invalid invitation code.' });
      }

      if (invite.used) {
        return res
          .status(400)
          .json({ error: 'Invitation code has already been used.' });
      }

      // The invitation is valid and not used, so link the user
      invitedBy = invite.owner;
    }

    // Create new user
    const newUser = new User({
      name,
      phone,
      password: hashedPassword,
      role: role || 'client',
      loyaltyPoints: 0,
      walletBalance: 0,
      invitedBy: invitedBy || null,
      invites: [],
    });
    await newUser.save();

    // If user was invited, mark the invitation as used
    if (invitedBy) {
      await Invitation.findOneAndUpdate(
        { code },
        { used: true, usedBy: newUser._id },
      );

      // Also add the new user to the inviter's invites array (optional)
      await User.findByIdAndUpdate(invitedBy, {
        $push: { invites: newUser._id },
      });
    }

    // Generate a token (optional)
    const token = generateToken(newUser);

    return res.status(201).json({ token, userId: newUser._id, role: newUser.role });
  } catch (error) {
    console.error('Sign up error:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
}
