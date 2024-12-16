import Router from 'express-promise-router';
import authRouter from './authRouts';
import { chatRouts } from './charApp/chatRouts';
import { verifyJWT } from '../middlewares/auth.middlewares';
import { fileUploadRouter } from './fileUplaod';
import searchUsersRoutes from './searchUsers';
const router = Router();

router.use(authRouter);
router.use(fileUploadRouter);
router.use(searchUsersRoutes);
router.use('/chat-app', chatRouts);

export default router;
