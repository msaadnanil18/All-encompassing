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
