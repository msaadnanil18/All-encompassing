import { Router } from 'express';
import {
  newChatGroup,
  createChat,
} from '../../controllers/chatApp/message.controllers';
import List from '../../controllers/crudControllers/list';
import { fetchChatList } from '../../controllers/chatApp/chat.controllers';
import Edit from '../../controllers/crudControllers/edit';
const chatRouts = Router();

chatRouts.route('/chat-list').post(fetchChatList);
chatRouts.route('/create-GroupChats').post(newChatGroup);
chatRouts.route('/create-chat').post(createChat);
chatRouts.route('/message-list').post((req, res, next) => {
  List(req.db.Message, {})(req, res, next);
});
chatRouts.route('/archive-chat').post((req, res, next) => {
  Edit(req.db.Chat, {})(req, res, next);
});

chatRouts.route('/unarchive-chat').post((req, res, next) => {
  Edit(req.db.Chat, {})(req, res, next);
});
export { chatRouts };
