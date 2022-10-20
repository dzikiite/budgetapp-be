import prisma from '../../prisma/prisma.js';

export const categoriesControllerGet = async (req, res) => {
    const { userId } = req;

    const categoriesData = await prisma.categories.findMany({
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

    const categoryData = await prisma.categories.findUnique({
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

    const user = await prisma.users.findUnique({
        where: {
            user_id: userId,
        },
        include: { categories: true },
    });

    if (
        user.categories.some(
            (category) => category.category_name === category_name
        )
    ) {
        res.status(400).json({
            success: false,
            message: 'There is a category with the same name',
        });
    }

    const category = await prisma.categories.create({
        data: {
            category_name,
            user_id: userId,
        },
    });

    res.status(200).json({
        success: true,
        category,
    });
};

export const categoryControllerUpdate = async (req, res) => {
    const { userId, body: categoryNewData } = req;
    const { id } = req.params;

    const user = await prisma.users.findUnique({
        where: { user_id: userId },
        include: { categories: true },
    });

    const category = user.categories.filter(
        (category) => category.category_id === parseInt(id)
    )?.[0];

    if (!category) {
        return res.status(404).json({
            success: false,
            message: 'Category not found',
        });
    }

    const updatedCategory = await prisma.categories.update({
        where: {
            category_id: category.category_id,
        },
        data: {
            ...categoryNewData,
        },
    });

    return res.status(200).json({
        success: true,
        category: updatedCategory,
    });
};

export const categoryControllerDelete = async (req, res) => {
    const { userId } = req;
    const { id } = req.params;

    const user = await prisma.users.findUnique({
        where: { user_id: userId },
        include: { categories: true },
    });

    const category = user.categories.filter(
        (category) => category.category_id === parseInt(id)
    )?.[0];

    if (!category) {
        return res.status(404).json({
            success: false,
            message: 'Category not found',
        });
    }

    try {
        const deletedRow = await prisma.categories.delete({
            where: { category_id: category.category_id },
        });

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
