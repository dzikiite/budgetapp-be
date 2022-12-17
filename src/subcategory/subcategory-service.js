import prisma from '../../prisma/prisma.js';
import { HTTP_STATUS } from '../../helpers/constants.js';

const getSubcategories = async (categoryId, userId) => {
    const category = await prisma.categoriesTemplates.findFirst({
        where: { category_template_id: parseInt(categoryId), user_id: userId },
        include: {
            subcategories_templates: true,
        },
    });

    if (!category.subcategories_templates.length) {
        return {
            success: false,
            message: 'Subcategories not found',
            status: HTTP_STATUS.notFound,
        };
    }

    return category.subcategories_templates;
};

const addSubcategory = async (categoryId, userId, subcategoryData) => {
    const { subcategory_name } = subcategoryData;

    const category = await prisma.categoriesTemplates.findFirst({
        where: {
            category_template_id: parseInt(categoryId),
            user_id: userId,
        },
        include: {
            subcategories_templates: true,
        },
    });

    if (
        category.subcategories_templates.some(
            (subcategory) => subcategory.subcategory_name === subcategory_name
        )
    ) {
        return {
            success: false,
            message:
                'For specified category exist subcategory with the same name',
            status: HTTP_STATUS.badRequest,
        };
    }

    const subcategory = await prisma.subcategoriesTemplates.create({
        data: {
            ...subcategoryData,
            category_template_id: parseInt(categoryId),
        },
    });

    return subcategory;
};

const updateSubcategory = async (subcategoryId, userId, subcategoryNewData) => {
    const subcategory = await prisma.subcategoriesTemplates.findFirst({
        where: {
            subcategory_template_id: parseInt(subcategoryId),
        },
        include: {
            categories_templates: true,
        },
    });

    if (subcategory?.categories_templates?.user_id !== userId) {
        return {
            success: false,
            message: 'There is no subcategory associated for specify user',
            status: HTTP_STATUS.badRequest,
        };
    }

    const updatedSubcategory = await prisma.subcategoriesTemplates.update({
        where: {
            subcategory_template_id: parseInt(subcategoryId),
        },
        data: {
            ...subcategoryNewData,
        },
    });

    return updatedSubcategory;
};

const deleteSubcategory = async (subcategoryId, userId) => {
    const subcategory = await prisma.subcategoriesTemplates.findUnique({
        where: { subcategory_template_id: parseInt(subcategoryId) },
        include: { categories_templates: true },
    });

    if (!subcategory) {
        return {
            success: false,
            message: 'Subcategory not found',
            status: HTTP_STATUS.notFound,
        };
    }

    if (subcategory?.categories_templates?.user_id !== userId) {
        return {
            success: false,
            message: 'There is no subcategory associated for specify user',
            status: HTTP_STATUS.badRequest,
        };
    }

    try {
        const deletedRow = await prisma.subcategoriesTemplates.delete({
            where: { subcategory_template_id: parseInt(subcategoryId) },
        });

        if (deletedRow) {
            return {
                success: true,
                message: 'Subcategory deleted successfully',
            };
        }
    } catch (err) {
        console.log('Error: ', err);

        return {
            success: false,
            message: 'An error occurred',
        };
    }
};

const verifySubcategoryByUser = async (subcategoryId, userId) => {
    const subcategory = prisma.subcategories.findFirst({
        where: { subcategory_id: parseInt(subcategoryId) },
        include: {
            categories: {
                include: {
                    budgets: {
                        include: {
                            users: {
                                select: {
                                    user_id: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    const isSubcategoryForSpecifiedUser =
        subcategory?.categories?.[0]?.budgets?.[0]?.users?.[0]?.user_id ===
        userId;

    return isSubcategoryForSpecifiedUser;
};

const updateAmount = async (subcategoryId, userId, amount) => {
    const verify = await verifySubcategoryByUser(subcategoryId, userId);

    if (!verify) {
        return {
            success: false,
            message: 'There is no subcategory for specified user',
            status: HTTP_STATUS.unauthorized,
        };
    }

    const subcategory = await prisma.subcategories.update({
        where: { subcategory_id: parseInt(subcategoryId) },
        data: {
            allocated_amount: parseFloat(amount),
        },
    });

    return subcategory;
};

export default {
    getSubcategories,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    updateAmount,
};
