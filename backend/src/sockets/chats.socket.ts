import { Socket } from 'socket.io';
import { ChatEventEnum } from '../constants/chatapp/constants';
import mongoose from 'mongoose';
import dayjs from 'dayjs';
import { getSockets } from '../utils';
import { Message } from '../models/chartApp/message.models';
import { Chat } from '../models/chartApp/chat.model';
import { userSocketIDS } from './socket';

export const mountJoinChatEvent = (socket: Socket) => {
  socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId) => {
    socket.join(chatId);
  });
  newChats(socket);
  delteMessage(socket);

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

const newChats = (socket: Socket) => {
  socket.on(
    ChatEventEnum.NEW_CHAT_EVENT,
    async ({
      messageEditId,
      messageId,
      content,
      chat: { _id, members },
      attachments,
    }) => {
      try {
        const id = messageEditId || new mongoose.Types.ObjectId(messageId);
        const currentTime = dayjs().toISOString();

        const attachmentsFormatted = attachments.map((attachment: string) => ({
          url: attachment,
        }));

        const messageForRealTime = {
          _id: id,
          sender: socket.user._id,
          content,
          attachments: attachmentsFormatted,
          chat: _id,
          createdAt: currentTime,
        };
        let _updatedChat = null;

        if (messageEditId) {
          const [_, updatedChatsList] = await Promise.all([
            Message.updateOne({ _id: messageEditId }, { content }),
            Chat.findByIdAndUpdate(_id, { $set: { updatedAt: currentTime } }),
          ]);

          _updatedChat = updatedChatsList;
        } else {
          const messageForDB = { ...messageForRealTime };

          const [_, updatedChatsList] = await Promise.all([
            Message.create(messageForDB),
            Chat.findByIdAndUpdate(_id, { $set: { updatedAt: currentTime } }),
          ]);
          _updatedChat = updatedChatsList;
        }

        const usersInSocket = getSockets(members);
        usersInSocket.forEach((socketId) => {
          if (socketId) {
            socket.to(socketId).emit(ChatEventEnum.NEW_CHAT_EVENT, {
              chatId: _id,
              message: messageForRealTime,
            });
          }
        });

        usersInSocket.forEach((socketId) => {
          if (socketId) {
            socket.to(socketId).emit(ChatEventEnum.UPDATED_CHATS_LIST, {
              updatedChatList: _updatedChat,
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
};

const delteMessage = (socket: Socket) => {
  socket.on(
    ChatEventEnum.DELETE_MESSAGE_EVENT,
    async ({ deleteMessageId, chat: { _id, members } }) => {
      try {
        const [_, updatedChat] = await Promise.all([
          Message.deleteOne({ _id: deleteMessageId }),
          Chat.findByIdAndUpdate(_id, {
            $set: { updatedAt: dayjs().toISOString() },
          }),
        ]);

        const usersInSocket = getSockets(members);
        usersInSocket.forEach((socketId) => {
          if (socketId) {
            socket
              .to(socketId)
              .emit(ChatEventEnum.DELETE_MESSAGE_EVENT, { deleteMessageId });
          }
        });
      } catch (error) {
        console.error('Error saving message: ', error);
        socket.emit(
          ChatEventEnum.DELETE_MESSAGE_EVENT,
          'Failed to save message to database.'
        );
      }
    }
  );
};
