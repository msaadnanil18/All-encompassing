import mongoose from 'mongoose';
const { Schema } = mongoose;

const charMessageSchema = new Schema(
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
    chat: { type: mongoose.Types.ObjectId, ref: 'chat' },
  },
  { timestamps: true }
);

export const charMessage = mongoose.model('ChatMessage', charMessageSchema);
