import { DataTypes } from 'sequelize';

import db from '../config/db.js';

const Subcategory = db.define('subcategories', {
    subcategory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    subcategory_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    allocated_amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    rest_amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
});

export default Subcategory;
