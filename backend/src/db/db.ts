import paginate from 'mongoose-paginate-v2';
import mongoose, { PaginateModel } from 'mongoose';

import { DB as AuthDb } from '../interfaces/auth';

export type Model<T> = mongoose.Model<T> & PaginateModel<T>;
export type SchemaMap = AuthDb;

export type SchemaKeys = keyof SchemaMap;

export type DB = {
  [name in SchemaKeys]: Model<SchemaMap[name]>;
};
