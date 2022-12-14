import categoryService from './category-service.js';
import { calculateRestAmount } from '../subcategory/calculate-rest-amount.js';
import { HTTP_STATUS } from '../../helpers/constants.js';

export const categoriesControllerGet = async (req, res) => {
    const { userId } = req;

    const categoriesData = await categoryService.findCategories(userId);

    if (!categoriesData) {
        return res.sendStatus(HTTP_STATUS.notFound).json({
            success: false,
            message: 'Categories not found',
        });
    }

    const categoriesWithSubcategories = await Promise.all(
        categoriesData.map(async (category) => {
            const subcategoriesWithRestAmount = await calculateRestAmount(
                category.subcategories
            );

            return { ...category, subcategories: subcategoriesWithRestAmount };
        })
    );

    return res.json({
        success: true,
        categoriesData: categoriesWithSubcategories,
    });
};

export const categoryControllerGet = async (req, res) => {
    const { userId } = req;
    const { id } = req.params;

    const categoryData = await categoryService.findCategories(userId, id);

    if (!categoryData) {
        return res.sendStatus(HTTP_STATUS.notFound).json({
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

    const category = await categoryService.addCategory(userId, newCategoryData);

    if (!category) {
        res.status(HTTP_STATUS.badRequest).json({
            success: false,
            message: 'There is a category with the same name',
        });
    }

    res.status(HTTP_STATUS.success).json({
        success: true,
        category,
    });
};

export const categoryControllerUpdate = async (req, res) => {
    const { userId, body: categoryNewData } = req;
    const { id } = req.params;

    const category = await categoryService.updateCategory(
        userId,
        id,
        categoryNewData
    );

    if (!category) {
        return res.status(HTTP_STATUS.notFound).json({
            success: false,
            message: 'Category not found',
        });
    }

    return res.status(HTTP_STATUS.success).json({
        success: true,
        category,
    });
};

export const categoryControllerDelete = async (req, res) => {
    const { userId } = req;
    const { id } = req.params;

    const deletedRow = await categoryService.deleteCategory(userId, id);

    if (deletedRow) {
        return res.json({
            success: true,
            message: 'Category deleted successfully',
        });
    } else {
        return res.json({
            success: false,
            message: 'An error occurred',
        });
    }
};
