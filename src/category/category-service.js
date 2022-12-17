import prisma from '../../prisma/prisma.js';

const findCategories = async (userId, categoryId) => {
    let categories;

    if (categoryId) {
        categories = await prisma.categoriesTemplates.findUnique({
            where: {
                user_id: userId,
                category_template_id: parseInt(categoryId),
            },
            include: { subcategories_templates: true },
        });
    } else {
        categories = await prisma.categoriesTemplates.findMany({
            where: { user_id: userId },
            include: { subcategories_templates: true },
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
        include: { categories_templates: true },
    });

    if (
        user.categories_templates.some(
            (category) => category.category_name === category_name
        )
    ) {
        return null;
    }

    const category = await prisma.categoriesTemplates.create({
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
        include: { categories_templates: true },
    });

    const category = user?.categories_templates?.filter(
        (category) => category.category_template_id === parseInt(categoryId)
    )?.[0];

    if (!category) {
        return null;
    }

    const updatedCategory = await prisma.categoriesTemplates.update({
        where: {
            category_template_id: category.category_template_id,
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
        include: { categories_templates: true },
    });

    const category = user?.categories_templates?.filter(
        (category) => category.category_template_id === parseInt(categoryId)
    )?.[0];

    if (!category) {
        return null;
    }

    try {
        const deletedRow = await prisma.categoriesTemplates.delete({
            where: { category_template_id: category.category_template_id },
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
