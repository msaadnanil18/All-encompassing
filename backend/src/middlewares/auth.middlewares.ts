import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import Jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import { PartialUser } from '../interfaces/auth';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Unauthorized request');
  }
  try {
    const decodeToken = Jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as { _id: ObjectId };
    const user = await req.db.User.findById(decodeToken?._id).select(
      '-password -isVerified -refreshToken'
    );
    if (!user) {
      throw new ApiError(401, 'Invalid access token');
    }
    req.user = user as PartialUser;

    next();
  } catch (error: any) {
    throw new ApiError(401, error?.message || 'Invalid access token');
  }
});
