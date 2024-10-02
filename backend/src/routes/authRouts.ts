import { Router } from 'express';
import {
  registerUser,
  verifyEmail,
  loginUser,
  updateThemeConfig,
  logOutUser,
} from '../controllers/auth.controller';
import { verifyJWT } from '../middlewares/auth.middlewares';
import { ApiResponse } from '../utils/ApiResponse';
import Edit from '../controllers/crudControllers/edit';
import { User } from '../models/user.model';

const authRouter = Router();

authRouter.route('/register').post(registerUser);
authRouter.route('/verify-emai').post(verifyEmail);
authRouter.route('/login').post(loginUser);
authRouter.use(verifyJWT);
authRouter.route('/init').post((req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, `${req.user.name} is logged in`));
});
authRouter.route('/logout').post(logOutUser);
authRouter.route('/update/theme-config').post(updateThemeConfig);
authRouter.route('/profile/edit').post(
  Edit(User, {
    filterQueryTransformer: async ({ user, filterQuery }) => {
      return {
        _id: user?._id,
        ...filterQuery,
      };
    },
  })
);
export default authRouter;
