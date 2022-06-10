import express from 'express';

import {
    userControllerGet,
    userControllerUpdate,
    userControllerDelete,
} from '../../controllers/user.controller.js';
import { authenticateToken } from '../../middlewares/authenticateToken.js';
import { ROUTES } from '../../helpers/constants.js';

const user = express.Router();

user.get(ROUTES.user, authenticateToken, userControllerGet);
user.put(ROUTES.user, authenticateToken, userControllerUpdate);
user.delete(ROUTES.user, authenticateToken, userControllerDelete);

export default user;
