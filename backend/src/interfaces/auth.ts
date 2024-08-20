export interface IUser extends Document {
  _id: string;
  username: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  refreshToken: string;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface DB {
  User: IUser;
}
export type PartialUser = Pick<IUser, '_id' | 'name' | 'email' | 'password'>;
