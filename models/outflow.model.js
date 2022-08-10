import { DataTypes } from 'sequelize';

import db from '../config/db.js';

const Outflow = db.define('outflows', {
    budget_outflow_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
});

export default Outflow;
