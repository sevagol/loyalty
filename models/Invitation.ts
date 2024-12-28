// models/Invitation.ts
import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IInvitation extends Document {
  code: string;
  owner: mongoose.Types.ObjectId; // The user who created the invite
  createdAt: Date;
  used: boolean;
  usedBy?: mongoose.Types.ObjectId; // The user who used the invite
}

const invitationSchema = new Schema<IInvitation>({
  code: { type: String, required: true, unique: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  used: { type: Boolean, default: false },
  usedBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Invitation: Model<IInvitation> =
  mongoose.models.Invitation ||
  mongoose.model<IInvitation>('Invitation', invitationSchema);

export default Invitation;
