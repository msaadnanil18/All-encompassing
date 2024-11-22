import mongoose from 'mongoose';

export const generateMessageId = (): string => {
  return new mongoose.Types.ObjectId().toHexString();
};
