import * as mongoose from 'mongoose';
import { DB } from '../db/db';
import { PartialUser } from '../interfaces/auth';

declare global {
  namespace Express {
    interface Request {
      db: DB;
      user: PartialUser;
    }
  }
}

declare module 'socket.io' {
  interface Socket {
    user?: User;
  }
}
