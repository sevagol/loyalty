import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '@/models/User';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (user: IUser) => {
  // IMPORTANT: You’ll want to store minimal data in the token,
  // e.g., userId, role, phone, etc.
  return jwt.sign(
    { userId: user._id, phone: user.phone, role: user.role },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '1d' }
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
};
