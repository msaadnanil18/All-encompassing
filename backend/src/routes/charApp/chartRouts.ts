import { Router } from 'express';
import {
  sendMessage,
  newChatGroup,
} from '../../controllers/chatApp/message.controllers';
const chartRouts = Router();

chartRouts.route('/send-message').post(sendMessage);
chartRouts.route('/create/chat').post(newChatGroup);

export { chartRouts };
