import { DataTypes } from 'sequelize';

import db from '../config/db.js';

const Category = db.define(
    'categories',
    {
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        category_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
    }
);

export default Category;
