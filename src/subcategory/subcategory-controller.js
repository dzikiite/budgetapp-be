import subcategoryService from './subcategory-service.js';

export const subcategoriesControllerGet = async (req, res) => {
    const { id: categoryId } = req.params;
    const { userId } = req;

    const subcategories = await subcategoryService.getSubcategories(
        categoryId,
        userId
    );

    if (subcategories?.success === false) {
        return res.status(subcategories.status).json(subcategories);
    }

    return res.json({
        success: true,
        subcategories,
    });
};

export const subcategoriesControllerPost = async (req, res) => {
    const { id: categoryId } = req.params;
    const { body: newSubcategoryData, userId } = req;

    const subcategory = await subcategoryService.addSubcategory(
        categoryId,
        userId,
        newSubcategoryData
    );

    if (subcategory?.success === false) {
        return res.status(subcategory.status).json(subcategory);
    }

    res.json({
        success: true,
        subcategory,
    });
};

export const subcategoriesControllerUpdate = async (req, res) => {
    const { id: subcategoryId } = req.params;
    const { body: subcategoryNewData, userId } = req;

    const subcategory = await subcategoryService.updateSubcategory(
        subcategoryId,
        userId,
        subcategoryNewData
    );

    if (subcategory?.success === false) {
        return res.status(subcategory.status).json(subcategory);
    }

    res.json({
        success: true,
        subcategory,
    });
};

export const subcategoriesControllerDelete = async (req, res) => {
    const { id: subcategoryId } = req.params;
    const { userId } = req;

    const response = await subcategoryService.deleteSubcategory(
        subcategoryId,
        userId
    );

    res.json(response);
};

export const subcategoriesControllerAmountUpdate = async (req, res) => {
    const { id: subcategoryId } = req.params;
    const {
        body: { amount },
        userId,
    } = req;

    const response = await subcategoryService.updateAmount(
        subcategoryId,
        userId,
        amount
    );

    res.json(response);
};
