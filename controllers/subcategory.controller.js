import prisma from '../prisma/prisma.js';

export const subcategoriesControllerGet = async (req, res) => {
    // TODO: Check querying category is associated to authenticate user
    const { id: categoryId } = req.params;
    const { userId } = req;

    const category = await prisma.categories.findFirst({
        where: { category_id: parseInt(categoryId), user_id: userId },
        include: {
            subcategories: true,
        },
    });

    if (!category.subcategories.length) {
        return res.status(404).json({
            success: false,
            message: 'Subcategories not found',
        });
    }

    return res.json({
        success: true,
        subcategories: category.subcategories,
    });
};

export const subcategoriesControllerPost = async (req, res) => {
    const { id: categoryId } = req.params;
    const { body: newSubcategoryData, userId } = req;
    const { subcategory_name } = newSubcategoryData;

    const category = await prisma.categories.findFirst({
        where: {
            category_id: parseInt(categoryId),
            user_id: userId,
        },
        include: {
            subcategories: true,
        },
    });

    if (
        category.subcategories.some(
            (subcategory) => subcategory.subcategory_name === subcategory_name
        )
    ) {
        res.status(400).json({
            success: false,
            message:
                'For specified category exist subcategory with the same name',
        });
    }

    const subcategory = await prisma.subcategories.create({
        data: {
            subcategory_name,
            category_id: parseInt(categoryId),
        },
    });

    res.json({
        success: true,
        subcategory,
    });
};

export const subcategoriesControllerUpdate = async (req, res) => {
    const { id: subcategoryId } = req.params;
    const { body: subcategoryNewData, userId } = req;

    const subcategory = await prisma.subcategories.findFirst({
        where: {
            subcategory_id: parseInt(subcategoryId),
        },
        include: {
            categories: true,
        },
    });

    console.log('userIdCategory: ', subcategory.categories.user_id);

    // TODO: Check the user is owner of the subcategory
    if (subcategory?.categories?.user_id !== userId) {
        res.status(401).json({
            success: false,
            message: 'There is no subcategory associated for specify user',
        });
    }

    const updatedSubcategory = await prisma.subcategories.update({
        where: {
            subcategory_id: parseInt(subcategoryId),
        },
        data: {
            ...subcategoryNewData,
        },
    });

    res.json({
        success: true,
        subcategory: updatedSubcategory,
    });
};

export const subcategoriesControllerDelete = async (req, res) => {
    const { id: subcategoryId } = req.params;
    const { userId } = req;

    const subcategory = await prisma.subcategories.findUnique({
        where: { subcategory_id: parseInt(subcategoryId) },
        include: { categories: true },
    });

    if (!subcategory) {
        return res.sendStatus(404).json({
            success: false,
            message: 'Subcategory not found',
        });
    }

    if (subcategory?.categories?.user_id !== userId) {
        res.status(401).json({
            success: false,
            message: 'There is no subcategory associated for specify user',
        });
    }

    try {
        const deletedRow = await prisma.subcategories.delete({
            where: { subcategory_id: parseInt(subcategoryId) },
        });

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
