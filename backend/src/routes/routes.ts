import Router from 'express-promise-router';
import authRouter from './authRouts';
import { chartRouts } from './chartRouts';
import { verifyJWT } from '../middlewares/auth.middlewares';
import { fileUploadRouter } from './fileUplaod';
const router = Router();

router.use(authRouter);
router.use(fileUploadRouter);
router.use(verifyJWT);
router.use('/chat-app', chartRouts);

export default router;
