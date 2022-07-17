import { Sequelize } from 'sequelize';

// TODO: Add variable to env
const sequelize = new Sequelize('budgetapp', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql',
});

export default sequelize;
