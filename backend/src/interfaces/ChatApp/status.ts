import { ObjectId } from 'mongoose';
export interface IStatus {
  user: ObjectId;
  isOnline: boolean;
  lastSeen: Date;
}

export interface DB {
  Status: IStatus;
}
