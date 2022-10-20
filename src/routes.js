import express from 'express';

import { requestLogger } from '../middlewares/request-logger.js';
import { user, auth } from './user/user-routes.js';
import categories from './category/categories-routes.js';
import subcategories from './subcategory/subcategories-routes.js';
import budgets from './budget/budgets-routes.js';
import { ROUTES } from '../helpers/constants.js';

const routes = express.Router();

routes.use(requestLogger);

routes.get(ROUTES.home, (req, res) => {
    res.status(200).json({ success: true, message: 'Budget App Api' });
});

routes.use(`${ROUTES.api}${ROUTES.auth}`, auth);
routes.use(ROUTES.api, user);
routes.use(ROUTES.api, categories);
routes.use(ROUTES.api, subcategories);
routes.use(ROUTES.api, budgets);

export default routes;
