import express from 'express';

import {
    categoriesControllerGet,
    categoryControllerGet,
    categoryControllerPost,
    categoryControllerUpdate,
    categoryControllerDelete,
} from './category-controller.js';
import { authenticateToken } from '../../middlewares/authenticate-token.js';
import { ROUTES } from '../../helpers/constants.js';

const categories = express.Router();

categories.get(ROUTES.categories, authenticateToken, categoriesControllerGet);
categories.get(
    `${ROUTES.categories}/:id`,
    authenticateToken,
    categoryControllerGet
);
categories.post(ROUTES.categories, authenticateToken, categoryControllerPost);
categories.put(
    `${ROUTES.categories}/:id`,
    authenticateToken,
    categoryControllerUpdate
);
categories.delete(
    `${ROUTES.categories}/:id`,
    authenticateToken,
    categoryControllerDelete
);

export default categories;
