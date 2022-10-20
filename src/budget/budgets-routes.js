import express from 'express';

import {
    budgetsControllerGet,
    budgetsControllerPost,
    budgetControllerUpdate,
    budgetControllerDelete,
} from './budget-controller.js';
import { authenticateToken } from '../../middlewares/authenticate-token.js';
import { ROUTES } from '../../helpers/constants.js';

const budgets = express.Router();

budgets.get(ROUTES.budgets, authenticateToken, budgetsControllerGet);
budgets.post(ROUTES.budgets, authenticateToken, budgetsControllerPost);
budgets.put(`${ROUTES.budgets}/:id`, authenticateToken, budgetControllerUpdate);
budgets.delete(
    `${ROUTES.budgets}/:id`,
    authenticateToken,
    budgetControllerDelete
);

export default budgets;
