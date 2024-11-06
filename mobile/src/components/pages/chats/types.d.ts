export interface ChatListItemInterface {
  creator: string;
  createdAt: string;
  isGroupChat: true;
  lastMessage?: ChatMessageInterface;
  name: string;
  members: User[];
  updatedAt: string;
  _id: string;
}

export interface ChatMessageInterface {
  _id?: string;
  sender?:
    | Pick<User, '_id' | 'avatar' | 'email' | 'username' | 'name'>
    | string;
  content?: string;
  chat?: string;
  attachments?: {
    url?: string;
    localPath?: string;
    _id?: string;
  }[];
  createdAt?: string | number | Date;
  updatedAt?: string | number | Date;
}
