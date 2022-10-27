import express from 'express';

import {
    userControllerGet,
    userControllerUpdate,
    userControllerDelete,
    registerController,
    loginController,
} from './user-controller.js';
import { authenticateToken } from '../../middlewares/authenticate-token.js';
import { ROUTES } from '../../helpers/constants.js';

export const user = express.Router();
export const auth = express.Router();

user.get(ROUTES.user, authenticateToken, userControllerGet);
user.put(ROUTES.user, authenticateToken, userControllerUpdate);
user.delete(ROUTES.user, authenticateToken, userControllerDelete);
auth.post(ROUTES.register, registerController);
auth.post(ROUTES.login, loginController);
