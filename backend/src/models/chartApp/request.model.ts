import mongoose from 'mongoose';
import { IRequest } from '../../interfaces/ChatApp/request';
const { Schema } = mongoose;

const requestSchema = new Schema<IRequest>(
  {
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'accepted', 'rejected'],
    },
    sender: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    receivers: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const Request = mongoose.model<IRequest>('Request', requestSchema);
