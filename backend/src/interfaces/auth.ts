export interface IUser extends Document {
  _id: string;
  username: string;
  name: string;
  email: string;
  password: string;
}

export interface DB {
  User: IUser;
}
export type PartialUser = Pick<IUser, '_id' | 'name' | 'email' | 'password'>;
