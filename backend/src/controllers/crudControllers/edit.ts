import { SchemaKeys, DB, SchemaMap } from '../../db/db';
import { Request, RequestHandler, Response } from 'express';
import { PartialUser } from '../../interfaces/auth';
import { Model, FilterQuery, QueryOptions } from 'mongoose';

type EditResponse<M extends SchemaKeys, T> =
  | T
  | (SchemaMap[M] & { _id: string });

type EditQuery<M extends SchemaKeys> = FilterQuery<SchemaMap[M]>;
type EditPayload<M extends SchemaKeys> = Partial<SchemaMap[M]>;

interface EditOptions<
  M extends SchemaKeys,
  T,
  Query = any,
  Payload = any,
  Data = any,
  ReturnDoc = any,
> {
  validator?: any;
  skipValidator?: boolean;
  getDB?: (req: Request) => Promise<DB>;
  reqTransformer?: (req: Request) => Promise<Request>;
  filterQueryTransformer?: (_: {
    user: PartialUser | null;
    filterQuery: EditQuery<M>;
  }) => Promise<Query>;
  payloadTransformer?: (_: {
    user: PartialUser | null;
    payload: EditPayload<M>;
  }) => Promise<Payload>;
  options?: QueryOptions<M>;
  serializer?: (_: {
    user: PartialUser | null;
    data: EditResponse<M, T>;
  }) => Promise<Data>;
  returnDocSerializer?: (_: {
    user: PartialUser | null;
    data: EditResponse<M, T>;
  }) => Promise<ReturnDoc>;
  resourceIndex?: {
    nameKey: string;
    descriptionKey: string;
    anonymous?: boolean;
  };
  effects?: Array<
    (_: {
      user: PartialUser | null;
      query: Query;
      payload: Payload;
      data: Data;
      returnDocs?: ReturnDoc;
    }) => Promise<void>
  >;
}
const Edit =
  <M extends SchemaKeys, T>(
    modelName: Model<T>,
    {
      validator,
      skipValidator = false,
      getDB = async (req) => req.db,
      reqTransformer = async (req) => req,
      payloadTransformer = async ({ user, payload }) => payload,
      filterQueryTransformer = async ({ user, filterQuery }) => filterQuery,
      options = { multi: true },
      serializer = async ({ user, data }) => data,
      returnDocSerializer = async ({ user, data }) => data,
      resourceIndex,
      effects = [],
    }: EditOptions<M, T>
  ): RequestHandler =>
  async (
    _req: Request<
      {},
      {},
      {
        query: EditQuery<M>;
        payload: EditPayload<M>;
        returnDocs?: boolean;
        usePayloadUpdate?: boolean;
      }
    >,
    res: Response<EditResponse<M, T>>
  ) => {
    const req = await reqTransformer(_req);
    const user = req.user;
    const model = modelName;
    const payload = await payloadTransformer({
      user,
      payload: req.body.payload || {},
    });
    const query = await filterQueryTransformer({
      user,
      filterQuery: req.body.query || {},
    });

    const ogData = await model.updateMany(
      query,
      _req.body.usePayloadUpdate
        ? { ...payload }
        : {
            $set: {
              ...payload,
              ...(req.user
                ? {
                    updatedBy: {
                      $push: { user: req.user._id, time: new Date() },
                    },
                  }
                : {}),
            },
          },
      {}
    );
    const data = await serializer({
      user,
      data: JSON.parse(JSON.stringify(ogData)),
    });
    if (_req.body.returnDocs) {
      const docs = await model.find(query);
      const returnDocs = await returnDocSerializer({
        user,
        data: JSON.parse(JSON.stringify(docs)),
      });
      await Promise.all(
        effects.map((effect) =>
          effect({ user, query, payload, data, returnDocs })
        )
      );
      return res.json(returnDocs);
    }

    await Promise.all(
      effects.map((effect) => effect({ user, query, payload, data }))
    );
    return res.json(data);
  };

export default Edit;
