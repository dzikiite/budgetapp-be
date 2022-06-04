import express from 'express';
import 'dotenv/config';
import db from './config/db.js';

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 8000;

const app = express();

app.listen(PORT, async () => {
    console.log(`Express server listening on port ${8000}`);

    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database: ', error);
    }
});
