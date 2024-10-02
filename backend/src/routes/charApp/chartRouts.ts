import { Router } from 'express';
import {
  sendMessage,
  newChatGroup,
  createChat,
} from '../../controllers/chatApp/message.controllers';
import { Chat } from '../../models/chartApp/chat.model';
import List from '../../controllers/crudControllers/list';
import { Message } from '../../models/chartApp/message.models';
const chartRouts = Router();

chartRouts.route('/send-message').post(sendMessage);
chartRouts.route('/create-GroupChats').post(newChatGroup);
chartRouts.route('/create-chat').post(createChat);
chartRouts.route('/chat-list').post(List(Chat, {}));
chartRouts.route('/message-list').post(List(Message, {}));

export { chartRouts };
