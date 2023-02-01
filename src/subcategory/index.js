import express from 'express';

import {
    subcategoriesControllerGet,
    subcategoriesControllerPost,
    subcategoriesControllerUpdate,
    subcategoriesControllerDelete,
    subcategoriesControllerAmountUpdate,
} from './subcategory-controller.js';
import { authenticateToken } from '../../middlewares/authenticate-token.js';
import { ROUTES } from '../../helpers/constants.js';

const subcategories = express.Router();

subcategories.get(
    `${ROUTES.subcategories}/:id`,
    authenticateToken,
    subcategoriesControllerGet
);
subcategories.post(
    `${ROUTES.subcategories}/:id`,
    authenticateToken,
    subcategoriesControllerPost
);
subcategories.put(
    `${ROUTES.subcategories}/:id`,
    authenticateToken,
    subcategoriesControllerUpdate
);
subcategories.delete(
    `${ROUTES.subcategories}/:id`,
    authenticateToken,
    subcategoriesControllerDelete
);
subcategories.put(
    `${ROUTES.subcategories}${ROUTES.inflows}/:id`,
    authenticateToken,
    subcategoriesControllerAmountUpdate
);

export default subcategories;
