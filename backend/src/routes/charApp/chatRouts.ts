import { Router } from 'express';
import {
  sendMessage,
  newChatGroup,
  createChat,
} from '../../controllers/chatApp/message.controllers';
import { Chat } from '../../models/chartApp/chat.model';
import List from '../../controllers/crudControllers/list';
import { Message } from '../../models/chartApp/message.models';
const chatRouts = Router();

chatRouts.route('/chat-list').post(
  List(Chat, {
    populate: [
      {
        path: 'members',
        select: '-themConfig -refreshToken -password -isVerified',
      },
      {
        path: 'creator',
        select: '-password -refreshToken -themConfig -isVerified',
      },
      {
        path: 'lastMessage',
      },
      {
        path: 'archivedBy',
        select: '-password -refreshToken -themConfig -isVerified',
      },
    ],
    queryTransformer: async ({ user, query }) => {
      return {
        ...query,
        members: user?._id,
      };
    },
    optionsTransformer: async ({ user, options }) => {
      return {
        ...options,
        sort: { updatedAt: -1 },
      };
    },
  })
);
chatRouts.route('/create-GroupChats').post(newChatGroup);
chatRouts.route('/create-chat').post(createChat);

chatRouts.route('/message-list').post(List(Message, {}));

export { chatRouts };
