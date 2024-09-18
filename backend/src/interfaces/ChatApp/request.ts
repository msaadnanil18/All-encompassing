import { IUser } from '../auth';

export interface IRequest extends Document {
  status: 'pending' | 'accepted' | 'rejected';
  sender: IUser;
  receivers: IUser;
  createdAt: Date;
  updatedAt: Date;
}
