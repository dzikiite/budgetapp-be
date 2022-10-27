import prisma from '../../prisma/prisma.js';

const findCategories = async (userId, categoryId) => {
    let categories;

    if (categoryId) {
        categories = await prisma.categories.findUnique({
            where: { user_id: userId, category_id: categoryId },
        });
    } else {
        categories = await prisma.categories.findMany({
            where: { user_id: userId },
        });
    }

    return categories;
};

const addCategory = async (userId, categoryData) => {
    const { category_name } = categoryData;

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
        return null;
    }

    const category = await prisma.categories.create({
        data: {
            category_name,
            user_id: userId,
        },
    });

    return category;
};

const updateCategory = async (userId, categoryId, categoryNewData) => {
    const user = await prisma.users.findUnique({
        where: { user_id: userId },
        include: { categories: true },
    });

    const category = user?.categories?.filter(
        (category) => category.category_id === parseInt(categoryId)
    )?.[0];

    if (!category) {
        return null;
    }

    const updatedCategory = await prisma.categories.update({
        where: {
            category_id: category.category_id,
        },
        data: {
            ...categoryNewData,
        },
    });

    return updatedCategory;
};

const deleteCategory = async (userId, categoryId) => {
    const user = await prisma.users.findUnique({
        where: { user_id: userId },
        include: { categories: true },
    });

    const category = user?.categories?.filter(
        (category) => category.category_id === parseInt(categoryId)
    )?.[0];

    if (!category) {
        return null;
    }

    try {
        const deletedRow = await prisma.categories.delete({
            where: { category_id: category.category_id },
        });

        return deletedRow;
    } catch {
        return null;
    }
};

export default {
    findCategories,
    addCategory,
    updateCategory,
    deleteCategory,
};
