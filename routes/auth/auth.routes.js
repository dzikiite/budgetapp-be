import express from 'express';

import {
    registerController,
    loginController,
} from '../../controllers/auth.controller.js';
import { ROUTES } from '../../helpers/constants.js';

const auth = express.Router();

auth.post(ROUTES.register, registerController);
auth.post(ROUTES.login, loginController);

export default auth;
