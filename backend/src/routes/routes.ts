import Router from 'express-promise-router';
import authRouter from './authRouts';
import { chartRouts } from './chartRouts';
import { verifyJWT } from '../middlewares/auth.middlewares';

const router = Router();

router.use(authRouter);
router.use(verifyJWT);
router.use(chartRouts);

export default router;
