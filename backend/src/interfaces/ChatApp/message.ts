import { IUser } from '../auth';
import { IChat } from './chat';

export interface IMessage extends Document {
  sender: IUser;
  content: string;
  attachments: string[];
  chat: IChat;
  createdAt: Date;
  updatedAt: Date;
  readBy: IChat[];
  messageType: 'text' | 'image' | 'video' | 'file' | 'audio';
}

export interface DB {
  Message: IMessage;
}
