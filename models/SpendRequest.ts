import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ISpendRequest extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const spendRequestSchema = new Schema<ISpendRequest>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const SpendRequest: Model<ISpendRequest> =
  mongoose.models.SpendRequest || mongoose.model<ISpendRequest>('SpendRequest', spendRequestSchema);

export default SpendRequest;
