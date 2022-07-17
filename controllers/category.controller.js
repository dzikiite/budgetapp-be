import CategoryModel from '../models/category.model.js';

export const categoriesControllerGet = async (req, res) => {
    const { userId } = req;

    const categoriesData = await CategoryModel.findAll({
        where: { user_id: userId },
    });

    if (!categoriesData) {
        return res.sendStatus(404).json({
            success: false,
            message: 'Categories not found',
        });
    }

    return res.json({
        success: true,
        categoriesData,
    });
};

export const categoryControllerGet = async (req, res) => {
    const { userId } = req;
    const { id } = req.params;

    const categoryData = await CategoryModel.findOne({
        where: { user_id: userId, category_id: id },
    });

    if (!categoryData) {
        return res.sendStatus(404).json({
            success: false,
            message: 'Category not found',
        });
    }

    return res.json({
        success: true,
        categoryData,
    });
};

export const categoryControllerPost = async (req, res) => {
    const { userId, body: newCategoryData } = req;
    const { category_name } = newCategoryData;

    const duplicate = await CategoryModel.findOne({
        where: { category_name, user_id: userId },
    });

    if (duplicate) {
        res.status(400).json({
            success: false,
            message: 'There is a category with the same name',
        });
    }

    const category = CategoryModel.build({
        category_name,
        user_id: userId,
    });

    await category.save();

    res.json({
        success: true,
        category,
    });
};

export const categoryControllerUpdate = async (req, res) => {
    const { userId, body: categoryNewData } = req;
    const { id } = req.params;

    const category = await CategoryModel.findOne({
        where: { category_id: id, user_id: userId },
    });

    if (!category) {
        return res.sendStatus(404).json({
            success: false,
            message: 'Category not found',
        });
    }

    category.set({
        ...category,
        ...categoryNewData,
    });

    const updatedCategory = await category.save();

    return res.json({
        success: true,
        category: updatedCategory,
    });
};

export const categoryControllerDelete = async (req, res) => {
    const { userId } = req;
    const { id } = req.params;

    const category = await CategoryModel.findOne({
        where: { category_id: id, user_id: userId },
    });

    if (!category) {
        return res.sendStatus(404).json({
            success: false,
            message: 'Category not found',
        });
    }

    try {
        const deletedRow = await category.destroy();

        if (deletedRow) {
            return res.json({
                success: true,
                message: 'Category deleted successfully',
            });
        }
    } catch (err) {
        console.log('Error: ', err);

        return res.json({
            success: false,
            message: 'An error occurred',
        });
    }
};
