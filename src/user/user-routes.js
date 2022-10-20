import express from 'express';

import {
    userControllerGet,
    userControllerUpdate,
    userControllerDelete,
} from './user-controller.js';
import { registerController, loginController } from './auth-controller.js';
import { authenticateToken } from '../../middlewares/authenticate-token.js';
import { ROUTES } from '../../helpers/constants.js';

export const user = express.Router();
export const auth = express.Router();

user.get(ROUTES.user, authenticateToken, userControllerGet);
user.put(ROUTES.user, authenticateToken, userControllerUpdate);
user.delete(ROUTES.user, authenticateToken, userControllerDelete);
auth.post(ROUTES.register, registerController);
auth.post(ROUTES.login, loginController);
