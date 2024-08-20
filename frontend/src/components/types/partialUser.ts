export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;

  updatedAt: string;
  createdAt: string;
}
