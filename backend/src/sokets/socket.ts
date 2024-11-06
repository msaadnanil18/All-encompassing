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

export const userSocketIDS = new Map<string, Set<string>>();

const mountJoinChatEvent = (socket: Socket) => {
  socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId) => {
    socket.join(chatId);
  });
  socket.on(
    ChatEventEnum.NEW_CHAT_EVENT,
    async ({ content, chat: { _id, members }, attachments }) => {
      const id = new mongoose.Types.ObjectId();
      const messageForRealTime = {
        _id: id,
        sender: socket.user._id,
        content,
        attachments: attachments.map((attachment: string) => ({
          url: attachment,
        })),
        chat: _id,
        createdAt: dayjs().toISOString(),
      };
      const messageForDB = {
        _id: id,
        sender: socket.user._id,
        content,
        attachments: attachments.map((attachment: string) => ({
          url: attachment,
        })),
        chat: _id,
      };

      try {
        await Message.create(messageForDB);
        await Chat.findByIdAndUpdate(
          { _id },
          {
            $set: { updatedAt: dayjs().toISOString() },
          }
        );
        const usersInSocket = getSokets(members);

        console.log(usersInSocket, '______________$________');

        usersInSocket.forEach((socketId) => {
          if (socketId) {
            socket.to(socketId).emit(ChatEventEnum.NEW_CHAT_EVENT, {
              chatId: _id,
              message: messageForRealTime,
            });
          }
        });
      } catch (error) {
        console.error('Error saving message: ', error);
        socket.emit(
          ChatEventEnum.SOCKET_ERROR_EVENT,
          'Failed to save message to database.'
        );
      }
    }
  );

  socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
    const userSockets = userSocketIDS.get(socket.user._id.toString());
    if (userSockets) {
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        userSocketIDS.delete(socket.user._id.toString());
      }
    }
  });
};

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
