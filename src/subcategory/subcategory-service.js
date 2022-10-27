import prisma from '../../prisma/prisma.js';
import { HTTP_STATUS } from '../../helpers/constants.js';

const getSubcategories = async (categoryId, userId) => {
    const category = await prisma.categories.findFirst({
        where: { category_id: parseInt(categoryId), user_id: userId },
        include: {
            subcategories: true,
        },
    });

    if (!category.subcategories.length) {
        return {
            success: false,
            message: 'Subcategories not found',
            status: HTTP_STATUS.notFound,
        };
    }

    return category.subcategories;
};

const addSubcategory = async (categoryId, userId, subcategoryData) => {
    const { subcategory_name } = subcategoryData;

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
        return {
            success: false,
            message:
                'For specified category exist subcategory with the same name',
            status: HTTP_STATUS.badRequest,
        };
    }

    const subcategory = await prisma.subcategories.create({
        data: {
            category_id: parseInt(categoryId),
            ...subcategoryData,
        },
    });

    return subcategory;
};

const updateSubcategory = async (subcategoryId, userId, subcategoryNewData) => {
    const subcategory = await prisma.subcategories.findFirst({
        where: {
            subcategory_id: parseInt(subcategoryId),
        },
        include: {
            categories: true,
        },
    });

    // TODO: Check the user is owner of the subcategory
    if (subcategory?.categories?.user_id !== userId) {
        return {
            success: false,
            message: 'There is no subcategory associated for specify user',
            status: HTTP_STATUS.badRequest,
        };
    }

    const updatedSubcategory = await prisma.subcategories.update({
        where: {
            subcategory_id: parseInt(subcategoryId),
        },
        data: {
            ...subcategoryNewData,
        },
    });

    return updatedSubcategory;
};

const deleteSubcategory = async (subcategoryId, userId) => {
    const subcategory = await prisma.subcategories.findUnique({
        where: { subcategory_id: parseInt(subcategoryId) },
        include: { categories: true },
    });

    if (!subcategory) {
        return {
            success: false,
            message: 'Subcategory not found',
            status: HTTP_STATUS.notFound,
        };
    }

    if (subcategory?.categories?.user_id !== userId) {
        return {
            success: false,
            message: 'There is no subcategory associated for specify user',
            status: HTTP_STATUS.badRequest,
        };
    }

    try {
        const deletedRow = await prisma.subcategories.delete({
            where: { subcategory_id: parseInt(subcategoryId) },
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

export default {
    getSubcategories,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
};
