import { Router } from 'express';
import { searchUser } from '../controllers/searchUsers.controllers';

const searchUsersRoutes = Router();

searchUsersRoutes.route('/search').post(searchUser);

export default searchUsersRoutes;
