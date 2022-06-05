import { DataTypes } from 'sequelize';
// TODO: Set folder aliases
import db from '../config/db.js';

const User = db.define(
    'users',
    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        freezeTableName: true,
    }
);

export default User;
