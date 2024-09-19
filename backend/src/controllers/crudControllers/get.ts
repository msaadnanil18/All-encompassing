import { SchemaKeys, DB, SchemaMap } from '../../db/db';
import { Request, RequestHandler, Response } from 'express';
import { PartialUser } from '../../interfaces/auth';
import { FilterQuery } from 'mongoose';
import mongoose, { Model } from 'mongoose';

type GetResponse<M extends SchemaKeys, T> =
  | T
  | (SchemaMap[M] & { _id: string });
type GetQuery<M extends SchemaKeys> = FilterQuery<SchemaMap[M]>;

interface GetOptions<M extends SchemaKeys, T, Query = any, Data = any> {
  validator?: any;
  skipValidator?: boolean;
  populate?: Array<string>;
  getDB?: (req: Request) => Promise<DB>;
  reqTransformer?: (req: Request) => Promise<Request>;
  queryTransformer?: (_: {
    user: PartialUser | null;
    query: GetQuery<M>;
  }) => Promise<Query>;
  serializer?: (_: {
    user: PartialUser | null;
    data: GetResponse<M, T>;
    req: Request;
  }) => Promise<Data>;
  effects?: Array<(_: { query: Query; data: Data }) => Promise<void>>;
}

const Get =
  <M extends SchemaKeys, T>(
    modelName: Model<T>,
    {
      populate,
      validator,
      skipValidator = false,
      reqTransformer = async (req) => req,
      queryTransformer = async ({ user, query }) => query,
      serializer = async ({ user, data, req }) => data,
      effects = [],
    }: GetOptions<M, T>
  ): RequestHandler =>
  async (
    _req: Request<{}, {}, { query: GetQuery<M> }>,
    res: Response<GetResponse<M, T>>
  ) => {
    const req = await reqTransformer(_req);
    const user = req.user;
    const model = modelName;
    const query = await queryTransformer({
      user,
      query: req.body.query || {},
    } as any);
    let find = model.findOne(query, {});
    if (populate) {
      find = find.populate(populate);
    }
    const opData = await find;
    const data = await serializer({
      user,
      data: JSON.parse(JSON.stringify(opData)),
      req,
    });
    await Promise.all(effects.map((effect) => effect({ query, data })));
    return res.json(data);
  };

export default Get;
