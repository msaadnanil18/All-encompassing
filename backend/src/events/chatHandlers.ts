import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';
import { ChatEvent } from '../constants/chatapp/constants';
import { getSockets } from '../utils';
import { Chat } from '../models/chartApp/chat.model';

export const registerChatHandlers = (io: Server, socket: Socket) => {
  createChat(io, socket);
  createGroupChat(io, socket);
};

const createChat = (io: Server, socket: Socket) => {
  socket.on(ChatEvent.CHAT_CREATE_CHAT, async (receiver) => {
    console.log(receiver, 'sdfasdf');
    try {
      if (!receiver || !receiver._id) {
        throw new Error('Receiver information is missing.');
      }
      let chat = await Chat.findOneAndUpdate(
        {
          groupChat: false,
          members: {
            $all: [
              new Types.ObjectId(socket.user?._id),
              new Types.ObjectId(receiver?._id),
            ],
          },
        },
        {
          $pull: {
            deletedFor: socket.user._id,
          },
        },
        { new: true }
      );

      if (chat) {
        chat = await chat.populate([
          {
            path: 'members',
            select: '-password -refreshToken -themConfig -isVerified',
          },
        ]);
      }

      if (!chat) {
        const newChat = new Chat({
          isGroupChat: false,
          members: [socket.user?._id, receiver._id],
        });

        const savedChat = await newChat.save();
        chat = await savedChat.populate([
          {
            path: 'members',
            select: '-password -refreshToken -themConfig -isVerified',
          },
        ]);
      }

      const usersInSocket = getSockets([receiver]);
      usersInSocket.forEach((socketId) => {
        if (socketId) {
          io.to(socketId).emit(ChatEvent.CHAT_CREATE_CHAT, chat);
        }
      });

      socket.emit(ChatEvent.CHAT_CREATE_CHAT, chat);
    } catch (error) {
      console.error('Error in createChat:', error);
      socket.emit(ChatEvent.CHAT_ERROR, error || 'Failed to create chat.');
    }
  });
};

const createGroupChat = (io: Server, socket: Socket) => {
  socket.on(
    ChatEvent.CHAT_CREATE_GROUP_CHAT,
    async ({ groupAvatar = '', members = [], name }) => {
      try {
        if (!name || !Array.isArray(members) || members.length < 1) {
          throw new Error(
            'Group chat must have a name and at least 3 members (including creator).'
          );
        }
        const groupChat = new Chat({
          name,
          groupChat: true,
          groupAvatar,
          creator: socket.user._id,
          members: [...members, socket.user._id],
        });
        const saveGroupChat = await groupChat.save();
        const newGroupChat = await saveGroupChat.populate([
          {
            path: 'members',
            select: '-password -refreshToken -themConfig -isVerified',
          },
          {
            path: 'creator',
            select: '-password -refreshToken -themConfig -isVerified',
          },
        ]);

        const usersInSocket = getSockets(newGroupChat.members);

        usersInSocket.forEach((socketId) => {
          if (socketId) {
            io.to(socketId).emit(
              ChatEvent.CHAT_CREATE_GROUP_CHAT,
              newGroupChat
            );
          }
        });
        socket.emit(ChatEvent.CHAT_CREATE_CHAT, newGroupChat);
      } catch (error) {
        console.error('Error in create group Chat:', error);
        socket.emit(
          ChatEvent.CHAT_ERROR,
          error || 'Failed to create group chat.'
        );
      }
    }
  );
};
