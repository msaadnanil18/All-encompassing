import { Server as IOServer, Socket } from 'socket.io';
import {
  ChatEventEnum,
  AvailableChatEvents,
} from '../constants/chatapp/constants';
import cookie from 'cookie';
import Jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { User } from '../models/user.model';
import { ObjectId } from 'mongoose';

export const initialize_socket_setup = (io: IOServer) => {
  return io.on('connection', async (socket) => {
    try {
      console.log(socket.id, 'socketId');

      const cookies = cookie.parse(socket.handshake.headers?.cookie || '');
      let token = cookies?.accessToken;

      if (!token) {
        token = socket.handshake.auth?.token;
      }

      if (!token) {
        // Token is required for the socket to work
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
      socket.user = user;

      socket.join(user._id.toString());
      socket.emit(ChatEventEnum.CONNECTED_EVENT);
      console.log('User connected 🗼. userId: ', user._id.toString());

      mountJoinChatEvent(socket);
    } catch (error: any) {
      socket.emit(
        ChatEventEnum.SOCKET_ERROR_EVENT,
        error?.message || 'Something went wrong while connecting to the socket.'
      );
    }
  });
};

const mountJoinChatEvent = (socket: Socket) => {
  socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId) => {
    console.log(`User joined the. chatId: `, chatId);

    socket.join(chatId);
  });
  socket.on(ChatEventEnum.NEW_CHAT_EVENT, async (chat) => {
    console.log(chat, 'newCharEvent');

    socket.emit(ChatEventEnum.NEW_CHAT_EVENT, chat);
  });
};
