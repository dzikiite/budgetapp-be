import { DataTypes } from 'sequelize';

import db from '../config/db.js';
import BudgetModel from './budget.model.js';

const Inflow = db.define(
    'inflows',
    {
        budget_inflow_id: {
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
    },
    {
        hooks: {
            afterCreate: (inflow) => {
                BudgetModel.increment('total_amount', {
                    by: inflow.amount,
                    where: { budget_id: inflow.budget_id },
                });
            },
        },
    }
);

export default Inflow;
