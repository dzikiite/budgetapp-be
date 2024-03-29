import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import cors from 'cors';

import routes from './src/routes.js';
import { ROUTES, HTTP_STATUS } from './helpers/constants.js';

const PORT = process.env.PORT || 8000;

const app = express();

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    res.status(err.status || HTTP_STATUS.badRequest).json({
        success: false,
        message: err.message || 'An error occured.',
        errors: err.error || [],
    });
};

const notFoundHandler = (req, res) => {
    res.status(HTTP_STATUS.notFound).json({
        success: false,
        message: 'Resource not found',
    });
};

// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(ROUTES.home, routes);
app.use(errorHandler);
app.use(notFoundHandler);

const initServer = () => {
    app.listen(PORT, () => {
        console.log(`Express server listening on port ${PORT}`);
    });
};

initServer();
