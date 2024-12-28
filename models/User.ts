// models/User.ts
import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;            // <-- NEW
  phone: string;
  password: string;
  role: 'client' | 'owner';
  loyaltyPoints: number;
  walletBalance: number;
  invitedBy?: mongoose.Types.ObjectId;
  invites: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true }, // <-- NEW
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
