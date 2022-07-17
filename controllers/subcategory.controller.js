import SubcategoryModel from '../models/subcategory.model.js';

export const subcategoriesControllerGet = async (req, res) => {
    const { id: categoryId } = req.params;

    const subcategoriesData = await SubcategoryModel.findAll({
        where: { category_id: categoryId },
    });

    if (!subcategoriesData) {
        return res.sendStatus(404).json({
            success: false,
            message: 'Subcategories not found',
        });
    }

    return res.json({
        success: true,
        subcategoriesData,
    });
};

export const subcategoriesControllerPost = async (req, res) => {
    const { id: categoryId } = req.params;
    const { body: newSubcategoryData } = req;
    const { subcategory_name } = newSubcategoryData;

    const duplicate = await SubcategoryModel.findOne({
        where: { subcategory_name, category_id: categoryId },
    });

    if (duplicate) {
        res.status(400).json({
            success: false,
            message:
                'For specified category exist subcategory with the same name',
        });
    }

    const subcategory = SubcategoryModel.build({
        subcategory_name,
        category_id: categoryId,
        allocated_amount: 0.0,
        rest_amount: 0.0,
    });

    await subcategory.save();

    res.json({
        success: true,
        subcategory,
    });
};

export const subcategoriesControllerUpdate = async (req, res) => {
    const { id: subcategoryId } = req.params;
    const { body: subcategoryNewData } = req;

    const subcategory = await SubcategoryModel.findOne({
        where: { subcategory_id: subcategoryId },
    });

    if (!subcategory) {
        return res.sendStatus(404).json({
            success: false,
            message: 'Subcategory not found',
        });
    }

    subcategory.set({
        ...subcategory,
        ...subcategoryNewData,
    });

    const updatedSubcategory = await subcategory.save();

    return res.json({
        success: true,
        subcategory: updatedSubcategory,
    });
};

export const subcategoriesControllerDelete = async (req, res) => {
    const { id: subcategoryId } = req.params;

    const subcategory = await SubcategoryModel.findOne({
        where: { subcategory_id: subcategoryId },
    });

    if (!subcategory) {
        return res.sendStatus(404).json({
            success: false,
            message: 'Subcategory not found',
        });
    }

    try {
        const deletedRow = await subcategory.destroy();

        if (deletedRow) {
            return res.json({
                success: true,
                message: 'Subcategory deleted successfully',
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
