import Router from 'express-promise-router';
import authRouter from './authRouts';
import { chartRouts } from './charApp/chartRouts';
import { verifyJWT } from '../middlewares/auth.middlewares';
import { fileUploadRouter } from './fileUplaod';
import searchUsersRoutes from './searchUsers';
const router = Router();

router.use(authRouter);
router.use(fileUploadRouter);
router.use(searchUsersRoutes);
router.use('/chat-app', chartRouts);

export default router;
