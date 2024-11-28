import mongoose from 'mongoose';
import 'react-native-get-random-values';

export const generateMessageId = (): string => {
  return new mongoose.Types.ObjectId().toHexString();
};
