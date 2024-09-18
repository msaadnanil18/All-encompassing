import mongoose from 'mongoose';
const { Schema } = mongoose;
import { IMessage } from '../../interfaces/ChatApp/message';

const charMessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
    },
    attachments: {
      type: [
        {
          url: 'string',
        },
      ],
      default: [],
    },
    chat: { type: mongoose.Types.ObjectId, ref: 'Chat' },
  },
  { timestamps: true }
);

export const Message = mongoose.model<IMessage>('Message', charMessageSchema);
