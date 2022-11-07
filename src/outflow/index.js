import express from 'express';

import {
    addOutflowController,
    getOutflowsController,
    updateOutflowController,
    deleteOutflowController,
} from './outflow-controller.js';
import { authenticateToken } from '../../middlewares/authenticate-token.js';
import { ROUTES } from '../../helpers/constants.js';

const outflows = express.Router();

outflows.post(
    `${ROUTES.outflows}/:budgetId/:subcategoryId`,
    authenticateToken,
    addOutflowController
);
outflows.get(
    `${ROUTES.outflows}/:budgetId/:subcategoryId`,
    authenticateToken,
    getOutflowsController
);
outflows.put(
    `${ROUTES.outflows}/:outflowId`,
    authenticateToken,
    updateOutflowController
);
outflows.delete(
    `${ROUTES.outflows}/:outflowId`,
    authenticateToken,
    deleteOutflowController
);

export default outflows;
