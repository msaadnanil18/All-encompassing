import { Router } from 'express';
import List from '../controllers/crudControllers/list';
import { User } from '../models/user.model';

const searchUsersRoutes = Router();

searchUsersRoutes.route('/search').post(List(User, {}));

searchUsersRoutes.route('/firebase-test').post(() => {});

export default searchUsersRoutes;
