import { IUser } from '../auth';

export interface IChat extends Document {
  name: string;
  groupChat: boolean;
  creator: IUser;
  members: IUser[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DB {
  chat: IChat;
}
