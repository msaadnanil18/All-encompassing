import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { DB } from '../db/db';
const dbMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.db = mongoose.models as unknown as DB;
  next();
};

export default dbMiddleware;
