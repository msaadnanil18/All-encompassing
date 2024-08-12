import { SchemaKeys, DB, SchemaMap } from '../../db/db';
import { Request, RequestHandler, Response } from 'express';
import { PartialUser } from '../../interfaces/auth';
import mongoose, { Model } from 'mongoose';
type CreateResponse<M extends SchemaKeys, T> =
  | T
  | (SchemaMap[M] & { _id: string });
type CreatePayload<M extends SchemaKeys> = SchemaMap[M];
interface CreateEditOptions<
  M extends SchemaKeys,
  T,
  Payload = any,
  Data = any,
> {
  getDB?: (req: Request) => Promise<DB>;
  reqTransformer?: (req: Request) => Promise<Request>;
  payloadTransformer?: (_: {
    user: any | null;
    payload: CreatePayload<M>;
  }) => Promise<Payload>;
  serializer?: (_: {
    user: PartialUser | null;
    data: Promise<CreateResponse<M, T>>;
  }) => Promise<Data>;
  effects?: Array<
    (_: {
      user: PartialUser | null;
      data: Data;
      payload: Payload;
    }) => Promise<void>
  >;
}

const create =
  <M extends SchemaKeys, T>(
    modelName: Model<T>,
    {
      getDB = async (req) => req.db,
      reqTransformer = async (req) => req,
      payloadTransformer = async ({ user, payload }) => payload,
      serializer = async ({ user, data }) => data,
      effects = [],
    }: CreateEditOptions<M, T>
  ): RequestHandler =>
  async (
    _req: Request<{}, {}, { payload: CreatePayload<M> }>,
    res: Response<CreateResponse<M, T>>
  ) => {
    const req = await reqTransformer(_req);
    const user = req.user;

    const payload = await payloadTransformer({
      user,
      payload: req.body.payload || {},
    });

    const obj = new modelName({
      ...payload,
      ...(req.user
        ? { createdBy: { user: req.user._id, time: new Date() } }
        : {}),
    });

    await obj.save();

    const data = await serializer({
      user,
      data: JSON.parse(JSON.stringify(obj)),
    });

    await Promise.all(effects.map((effect) => effect({ user, data, payload })));
    res.status(200).json(data);
  };

export default create;
