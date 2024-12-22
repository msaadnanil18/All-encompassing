import mongoose, { Schema } from 'mongoose';
import { IStatus } from '../../interfaces/ChatApp/status';

const statusSchema = new Schema<IStatus>(
  {
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    isOnline: { type: Boolean },
    lastSeen: { type: Date },
  },
  { timestamps: true }
);

export const Status = mongoose.model<IStatus>('Status', statusSchema);
