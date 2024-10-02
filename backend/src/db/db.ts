import paginate from 'mongoose-paginate-v2';
import mongoose, { PaginateModel } from 'mongoose';

import { DB as AuthDb } from '../interfaces/auth';
import { DB as Chat } from '../interfaces/ChatApp/chat';
import { DB as Message } from '../interfaces/ChatApp/message';
import { DB as Request } from '../interfaces/ChatApp/request';

export type Model<T> = mongoose.Model<T> & PaginateModel<T>;
export type SchemaMap = AuthDb & Chat & Message & Request;

export type SchemaKeys = keyof SchemaMap;

export type DB = {
  [name in SchemaKeys]: Model<SchemaMap[name]>;
};
