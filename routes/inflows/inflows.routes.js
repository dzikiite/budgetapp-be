import express from 'express';

import {
    inflowsControllerGet,
    inflowControllerPost,
    budgetInflowsControllerGet,
    inflowControllerUpdate,
    inflowControllerDelete,
} from '../../controllers/inflow.controller.js';
import { authenticateToken } from '../../middlewares/authenticateToken.js';
import { ROUTES } from '../../helpers/constants.js';

const inflows = express.Router();

inflows.get(ROUTES.inflows, authenticateToken, inflowsControllerGet);
inflows.get(
    `${ROUTES.inflows}/:id`,
    authenticateToken,
    budgetInflowsControllerGet
);
inflows.post(`${ROUTES.inflows}/:id`, authenticateToken, inflowControllerPost);
inflows.put(`${ROUTES.inflows}/:id`, authenticateToken, inflowControllerUpdate);
inflows.delete(
    `${ROUTES.inflows}/:id`,
    authenticateToken,
    inflowControllerDelete
);

export default inflows;
