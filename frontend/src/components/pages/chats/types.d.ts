import { User } from '../../types/partialUser';

export interface ChatListItem {
  _id?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
  groupChat: boolean;
  groupAvatar?: file;
  members: Array<User>;
  creator?: User;
  lastMessage?: MessageListItems;
  createdAt: Date;
  updatedAt: Date;
  archivedBy: Array<ArchiveChat>;
}

type ArchiveChat = {
  user?: User;
  archivedAt: string;
};
export interface MessageListItems {
  _id?: string;
  sender: PartialUser | null;
  content: string;
  attachments?: string[];
  chat: ChatListItem;
  readBy?: PartialUser[];
  messageType?: 'text' | 'file';
  createdAt?: string;
  updatedAt?: string;
}

export type DisplayView = 'all' | 'unread' | 'archived' | 'groups';
