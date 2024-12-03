import { Server as IOServer, Socket } from 'socket.io';
import {
  ChatEventEnum,
  AvailableChatEvents,
} from '../constants/chatapp/constants';
import cookie from 'cookie';
import Jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { User } from '../models/user.model';
import mongoose, { ObjectId } from 'mongoose';
import dayjs from 'dayjs';
import { getSokets } from '../utils';
import { Message } from '../models/chartApp/message.models';
import { Chat } from '../models/chartApp/chat.model';
import { mountJoinChatEvent } from './chats.socket';

export const userSocketIDS = new Map<string, Set<string>>();

export const initialize_socket_setup = (io: IOServer) => {
  return io.on('connection', async (socket) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || '');
      let token = cookies?.accessToken || socket.handshake.auth.token;

      if (!token) {
        token = socket.handshake.auth?.token;
      }

      if (!token) {
        throw new ApiError(401, 'Un-authorized handshake. Token is missing');
      }

      const decodedToken = Jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as { _id: ObjectId };

      const user = await User.findById(decodedToken?._id).select(
        '-password -refreshToken -themConfig -isVerified'
      );
      if (!user) {
        throw new ApiError(401, 'Un-authorized handshake. Token is invalid');
      }
      if (!userSocketIDS.has(user._id.toString())) {
        userSocketIDS.set(user._id.toString(), new Set());
      }
      userSocketIDS.get(user._id.toString())?.add(socket.id);
      socket.user = user;

      socket.join(user._id.toString());
      socket.emit(ChatEventEnum.CONNECTED_EVENT, { coneection: 'success' });
      console.log('User connected 🗼. userId: ', userSocketIDS);

      mountJoinChatEvent(socket);
    } catch (error: any) {
      socket.emit(
        ChatEventEnum.SOCKET_ERROR_EVENT,
        error?.message || 'Something went wrong while connecting to the socket.'
      );
    }
  });
};

const subscribe = <T = (r: any) => void>(event: string, onSubscribe: T) => {};
