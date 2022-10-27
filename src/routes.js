import express from 'express';

import { requestLogger } from '../middlewares/request-logger.js';
import { user, auth } from './user/index.js';
import categories from './category/index.js';
import subcategories from './subcategory/index.js';
import budgets from './budget/index.js';
import { ROUTES, HTTP_STATUS } from '../helpers/constants.js';

const routes = express.Router();

routes.use(requestLogger);

routes.get(ROUTES.home, (req, res) => {
    res.status(HTTP_STATUS.success).json({
        success: true,
        message: 'Budget App Api',
    });
});

routes.use(`${ROUTES.api}${ROUTES.auth}`, auth);
routes.use(ROUTES.api, user);
routes.use(ROUTES.api, categories);
routes.use(ROUTES.api, subcategories);
routes.use(ROUTES.api, budgets);

export default routes;
