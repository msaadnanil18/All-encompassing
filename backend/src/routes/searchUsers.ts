import { Router } from 'express';
import List from '../controllers/crudControllers/list';
import { User } from '../models/user.model';
import { firebaseReq } from '../controllers/chatApp/firebaseRequestTest';

const searchUsersRoutes = Router();

searchUsersRoutes.route('/search').post(List(User, {}));

searchUsersRoutes.route('/firebase-test').post(firebaseReq);

export default searchUsersRoutes;
