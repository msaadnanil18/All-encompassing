import { Router } from 'express';
import { sendMessage } from '../controllers/chatApp/message.controllers';
const chartRouts = Router();

chartRouts.route('/send-message').post(sendMessage);

export { chartRouts };
