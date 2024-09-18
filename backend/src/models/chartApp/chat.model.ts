import mongoose from 'mongoose';
import { IChat } from '../../interfaces/ChatApp/chat';

const { Schema } = mongoose;

const charSchema = new Schema<IChat>(
  {
    name: {
      type: String,
      required: true,
    },
    groupChat: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    members: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

export const Chat = mongoose.model<IChat>('Chat', charSchema);
