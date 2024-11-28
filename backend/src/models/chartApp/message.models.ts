import mongoose from 'mongoose';
const { Schema } = mongoose;
import { IMessage } from '../../interfaces/ChatApp/message';
import mongoosePaginate from 'mongoose-paginate-v2';
const charMessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
    },
    attachments: {
      type: [
        {
          url: { type: String },
          fileType: { type: String },
        },
      ],
      default: [],
    },
    chat: { type: mongoose.Types.ObjectId, ref: 'Chat', required: true },
  },
  { timestamps: true }
);

charMessageSchema.plugin(mongoosePaginate);
export const Message = mongoose.model<IMessage>('Message', charMessageSchema);
