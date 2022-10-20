import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';

import routes from './routes/index.js';
import { ROUTES } from './helpers/constants.js';

const PORT = process.env.PORT || 8000;

const app = express();

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    res.status(err.status || 400).json({
        success: false,
        message: err.message || 'An error occured.',
        errors: err.error || [],
    });
};

const notFoundHandler = (req, res) => {
    res.status(404).json({ success: false, message: 'Resource not found' });
};

// Middlewares
app.use(bodyParser.json());
app.use(ROUTES.home, routes);
app.use(errorHandler);
app.use(notFoundHandler);

const initServer = async () => {
    app.listen(PORT, async () => {
        console.log(`Express server listening on port ${PORT}`);
    });
};

initServer();
