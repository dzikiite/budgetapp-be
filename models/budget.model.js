import { DataTypes } from 'sequelize';

import db from '../config/db.js';

const Budget = db.define('budgets', {
    budget_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    budget_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    total_amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    rest_amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
});

export default Budget;
