import express from 'express';

import {
    getInflowsController,
    addInflowController,
    updateInflowController,
    deleteInflowController,
} from './inflow-controller.js';
import { authenticateToken } from '../../middlewares/authenticate-token.js';
import { ROUTES } from '../../helpers/constants.js';

const inflows = express.Router();

inflows.get(`${ROUTES.inflows}/:id`, authenticateToken, getInflowsController);
inflows.post(`${ROUTES.inflows}/:id`, authenticateToken, addInflowController);
inflows.put(
    `${ROUTES.inflows}/:id/:inflowId`,
    authenticateToken,
    updateInflowController
);
inflows.delete(
    `${ROUTES.inflows}/:id/:inflowId`,
    authenticateToken,
    deleteInflowController
);

export default inflows;
