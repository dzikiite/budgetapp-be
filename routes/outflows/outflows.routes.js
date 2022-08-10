import express from 'express';

import { outflowControllerPost } from '../../controllers/outflow.controller.js';
import { authenticateToken } from '../../middlewares/authenticateToken.js';
import { ROUTES } from '../../helpers/constants.js';

const outflows = express.Router();

outflows.post(
    `${ROUTES.outflows}/:budget_id/:subcategory_id`,
    authenticateToken,
    outflowControllerPost
);

export default outflows;
