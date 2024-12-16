import mongoose from 'mongoose';
import { IChat } from '../../interfaces/ChatApp/chat';
import mongoosePaginate from 'mongoose-paginate-v2';
const { Schema } = mongoose;

const charSchema = new Schema<IChat>(
  {
    name: {
      type: String,
    },
    groupChat: {
      type: Boolean,
      default: false,
    },
    groupAvatar: { type: String },
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
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    archivedBy: [
      {
        user: { type: mongoose.Types.ObjectId, ref: 'User' },
        archivedAt: { type: Date },
      },
    ],
  },
  { timestamps: true }
);
charSchema.plugin(mongoosePaginate);

export const Chat = mongoose.model<IChat>('Chat', charSchema);
