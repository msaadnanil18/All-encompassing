import { Server as IOServer, Socket } from 'socket.io';
import cookie from 'cookie';
import Jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { User } from '../models/user.model';
import { ObjectId } from 'mongoose';
import { registerAllHandlers } from './registerAllHandlers';

export const userSocketIDS = new Map<string, Set<string>>();

export const configureSocket = (io: IOServer) => {
  io.on('connection', async (socket) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || '');
      let token = cookies?.accessToken || socket.handshake.auth?.token;

      if (!token) {
        throw new ApiError(401, 'Unauthorized handshake. Token is missing.');
      }

      if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new ApiError(
          500,
          'Server configuration error: Missing token secret.'
        );
      }

      const decodedToken = Jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      ) as { _id: ObjectId };

      const user = await User.findById(decodedToken._id).select(
        '-password -refreshToken -themConfig -isVerified'
      );

      if (!user) {
        throw new ApiError(401, 'Unauthorized handshake. Token is invalid.');
      }

      const userId = user._id.toString();
      if (!userSocketIDS.has(userId)) {
        userSocketIDS.set(userId, new Set());
      }
      userSocketIDS.get(userId)?.add(socket.id);

      socket.user = user;
      console.log(`User connected 🗼. userId:`, userSocketIDS);

      registerAllHandlers(io, socket);

      socket.on('disconnect', (reason) => {
        console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);

        const userSockets = userSocketIDS.get(userId);
        if (userSockets) {
          userSockets.delete(socket.id);
          if (userSockets.size === 0) {
            userSocketIDS.delete(userId);
          }
        }
      });
    } catch (error: any) {
      console.error(`Socket connection error: ${error.message}`);
      socket.emit(
        'SOCKET_ERROR_EVENT',
        error?.message || 'Something went wrong while connecting to the socket.'
      );
    }
  });
};
