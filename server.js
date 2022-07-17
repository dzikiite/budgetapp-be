import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';

import db from './config/db.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { setModelsRelations } from './helpers/setModelsRelations.js';
import { ROUTES } from './helpers/constants.js';

const PORT = process.env.PORT || 8000;

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(ROUTES.home, routes);
app.use(errorHandler);
app.use(notFoundHandler);

// Set sequelize model relations
setModelsRelations();

// Sync models with database tables
db.sync({ alter: true });

const checkDatabaseConnection = async () => {
    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.log('Unable to connect to the database');
        console.log(error.message);
        process.exit(1);
    }
};

const initServer = async () => {
    app.listen(PORT, async () => {
        console.log(`Express server listening on port ${PORT}`);

        await checkDatabaseConnection();
    });
};

initServer();
