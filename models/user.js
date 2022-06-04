import { DataTypes } from 'sequelize';
// TODO: Set folder aliases
import db from '../config/db.js';

const User = db.define('User', {
    firstName: {
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
});

export default User;
