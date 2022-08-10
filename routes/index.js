import express from 'express';

import { requestLogger } from '../middlewares/requestLogger.js';
import auth from './auth/auth.routes.js';
import user from './user/user.routes.js';
import categories from './categories/categories.routes.js';
import subcategories from './subcategories/subcategories.routes.js';
import budgets from './budgets/budgets.routes.js';
import inflows from './inflows/inflows.routes.js';
import outflows from './outflows/outflows.routes.js';
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
routes.use(ROUTES.api, inflows);
routes.use(ROUTES.api, outflows);

export default routes;
