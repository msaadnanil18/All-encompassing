import mongoose from 'mongoose';
import { IUser } from '../auth';
import { IMessage } from './message';

export interface IChat extends Document {
  name: string;
  groupChat: boolean;
  creator: IUser;
  members: IUser[];
  createdAt: Date;
  updatedAt: Date;
  lastMessage: IMessage | mongoose.ObjectId;
  archivedBy: Array<ArchivedBy>;
  deletedFor: Array<IUser>;
}

type ArchivedBy = {
  user: IUser;
  archivedAt: Date;
};

export interface DB {
  Chat: IChat;
}
