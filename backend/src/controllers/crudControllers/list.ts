import { SchemaKeys, DB, SchemaMap } from '../../db/db';
import { Request, RequestHandler, Response } from 'express';
import { PartialUser } from '../../interfaces/auth';
import { Model, FilterQuery, PaginateOptions } from 'mongoose';

type ListResponse<M extends SchemaKeys, T> =
  | T
  | (SchemaMap[M] & { _id: string });

type ListQuery<M extends SchemaKeys> = FilterQuery<SchemaMap[M]>;

export type ReqTransformer = (req: Request) => Promise<Request>;

interface ListOptions<M extends SchemaKeys, T, Query = any, Data = any> {
  validator?: any;
  skipValidator?: boolean;
  maxLimit?: number;
  populate?: Array<{}>;
  getDB?: (req: Request) => Promise<DB>;
  reqTransformer?: ReqTransformer;
  optionsTransformer?: (_: {
    user: PartialUser | null;
    options: PaginateOptions;
  }) => Promise<PaginateOptions>;
  queryTransformer?: (_: {
    user: PartialUser | null;
    query: ListQuery<M>;
  }) => Promise<Query>;
  serializer?: (_: {
    user: PartialUser | null;
    data: ListResponse<M, T>;
  }) => Promise<Data>;
  effects?: Array<(_: { query: Query; data: Data }) => Promise<void>>;
}

const List =
  <M extends SchemaKeys, T>(
    modelName: Model<T>,

    {
      populate: popu,
      validator,
      maxLimit = 20,
      skipValidator = false,
      getDB = async (req) => req.db,
      reqTransformer = async (req) => req,
      optionsTransformer = async ({ user, options }) => options,
      queryTransformer = async ({ user, query }) => query,
      serializer = async ({ user, data }) => data,
      effects = [],
    }: ListOptions<M, T>
  ): RequestHandler =>
  async (
    _req: Request<{}, {}, { query: ListQuery<M>; options: PaginateOptions }>,
    res: Response<ListResponse<M, T>>
  ) => {
    const req = await reqTransformer(_req);
    const user = req.user;
    const model = modelName as any;
    const limit = Math.min(
      Number((req.body.options || {}).limit || 10),
      maxLimit
    );

    const populate = (req.body.options || []).populate || popu;
    const page = Number((req.body.options || {}).page || 0) || 1;
    const {
      searchFields: __searchFields = [
        'name',
        'email',
        'phone',
        'notes',
        'address',
        'subtitle',
        'description',
        'data',
        'title',
      ],
      search: __search,
      ...restQuery
    } = req.body?.query || {};

    const options = await optionsTransformer({
      user,
      options: {
        ...req.body.options,
        page,
        limit,
        populate,
      },
    });

    const query = await queryTransformer({
      user,
      query: {
        ...(restQuery || {}),
        ...(__search && {
          ...((__searchFields || []).length > 1 && {
            $or: (__searchFields || []).map((field: string) => ({
              [field]: new RegExp(__search, 'gi'),
            })),
          }),

          ...(__searchFields.length === 1 && {
            [__searchFields[0]]: new RegExp(__search, 'gi'),
          }),
        }),
      },
    });

    const ogData = await model.paginate(query, options);
    const data = await serializer({
      user,
      data: JSON.parse(JSON.stringify(ogData)),
    });
    await Promise.all(effects.map((effect) => effect({ query, data })));
    return res.json(data);
  };

export default List;
