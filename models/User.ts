import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IUser extends Document {
  phone: string;
  password: string;
  role: 'client' | 'owner';
  // Each 6th coffee is free, so you might store how many coffees the user has
  // or how many marks they've earned, and track the free coffee usage.
  loyaltyPoints: number;
  walletBalance: number;

  // For referrals
  invitedBy?: mongoose.Types.ObjectId; // The user who invited this one
  invites: mongoose.Types.ObjectId[];  // List of users invited by this user
}

const userSchema = new Schema<IUser>({
  phone: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'owner'], required: true },
  loyaltyPoints: { type: Number, default: 0 },
  walletBalance: { type: Number, default: 0 },
  invitedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  invites: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
