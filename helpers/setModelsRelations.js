import User from '../models/user.model.js';
import Category from '../models/category.model.js';
import Subcategory from '../models/subcategory.model.js';
import Budget from '../models/budget.model.js';
import Inflow from '../models/inflow.model.js';
import Outflow from '../models/outflow.model.js';

export const setModelsRelations = () => {
    Category.belongsTo(User, { foreignKey: { name: 'user_id' } });
    User.hasMany(Category, { foreignKey: { name: 'user_id' } });

    Subcategory.belongsTo(Category, { foreignKey: { name: 'category_id' } });
    Category.hasMany(Subcategory, { foreignKey: { name: 'category_id' } });

    Budget.belongsTo(User, { foreignKey: { name: 'user_id' } });
    User.hasMany(Budget, { foreignKey: { name: 'user_id' } });

    Inflow.belongsTo(Budget, { foreignKey: { name: 'budget_id' } });
    Budget.hasMany(Inflow, { foreignKey: { name: 'budget_id' } });

    Outflow.belongsTo(Budget, { foreignKey: { name: 'budget_id' } });
    Budget.hasMany(Outflow, { foreignKey: { name: 'budget_id' } });

    Outflow.belongsTo(Subcategory, { foreignKey: { name: 'subcategory_id' } });
    Subcategory.hasMany(Outflow, { foreignKey: { name: 'subcategory_id' } });
};
