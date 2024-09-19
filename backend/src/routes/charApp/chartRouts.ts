import { Router } from 'express';
import {
  sendMessage,
  newChatGroup,
  createChat,
} from '../../controllers/chatApp/message.controllers';
import create from '../../controllers/crudControllers/create';
const chartRouts = Router();

chartRouts.route('/send-message').post(sendMessage);
chartRouts.route('/create-GroupChats').post(newChatGroup);
chartRouts.route('/create-chat').post(createChat);

export { chartRouts };
