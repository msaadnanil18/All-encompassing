import { Router } from 'express';
import {
  registerUser,
  verifyEmail,
  loginUser,
} from '../controllers/auth.controller';

const authRouter = Router();

authRouter.route('/register').post(registerUser);
authRouter.route('/verify-emai').post(verifyEmail);
authRouter.route('/login').post(loginUser);

export default authRouter;
