import User from '../models/user.model.js';
import Category from '../models/category.model.js';
import Subcategory from '../models/subcategory.model.js';

export const setModelsRelations = () => {
    Category.belongsTo(User, { foreignKey: { name: 'user_id' } });
    User.hasMany(Category, { foreignKey: { name: 'user_id' } });
    Subcategory.belongsTo(Category, { foreignKey: { name: 'category_id' } });
    Category.hasMany(Subcategory, { foreignKey: { name: 'category_id' } });
};
