import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IMarkRequest extends Document {
  userId: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const markRequestSchema = new Schema<IMarkRequest>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const MarkRequest: Model<IMarkRequest> =
  mongoose.models.MarkRequest || mongoose.model<IMarkRequest>('MarkRequest', markRequestSchema);

export default MarkRequest;
