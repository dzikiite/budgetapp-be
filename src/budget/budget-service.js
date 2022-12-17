import prisma from '../../prisma/prisma.js';
import { HTTP_STATUS } from '../../helpers/constants.js';

const getBudgets = async (userId) => {
    const budgets = await prisma.budgets.findMany({
        where: { user_id: userId },
        include: {
            inflows: true,
            categories: {
                include: {
                    subcategories: {
                        include: {
                            outflows: true,
                        },
                    },
                },
            },
        },
    });

    if (!budgets) {
        return {
            success: false,
            status: HTTP_STATUS.notFound,
            message: 'Budgets not found',
        };
    }

    return budgets;
};

const getBudget = async (userId, budgetId) => {
    const budget = await prisma.budgets.findFirst({
        where: { user_id: userId, budget_id: parseInt(budgetId) },
        include: {
            inflows: true,
            categories: {
                include: {
                    subcategories: {
                        include: {
                            outflows: true,
                        },
                    },
                },
            },
        },
    });

    if (!budget) {
        return {
            success: false,
            status: HTTP_STATUS.notFound,
            message: 'Budget not found',
        };
    }

    return budget;
};

const addBudget = async (userId, budgetData) => {
    const { budget_name } = budgetData;

    const duplicate = await prisma.budgets.findFirst({
        where: { user_id: userId, budget_name },
    });

    if (duplicate) {
        return {
            success: false,
            status: HTTP_STATUS.badRequest,
            message: 'There is a budget with the same name',
        };
    }

    const categoriesTemplates = await prisma.categoriesTemplates.findMany({
        where: { user_id: userId },
        include: { subcategories_templates: true },
    });

    const budget = await prisma.budgets.create({
        data: {
            budget_name,
            user_id: userId,
            categories: {
                create: categoriesTemplates.map((category) => {
                    const categoryCloned = { ...category };
                    const subcategories = category.subcategories_templates;
                    delete categoryCloned.subcategories_templates;
                    delete categoryCloned.category_template_id;
                    delete categoryCloned.user_id;

                    return {
                        ...categoryCloned,
                        subcategories: {
                            create: subcategories.map((subcategory) => {
                                const subcategoryCloned = { ...subcategory };
                                delete subcategoryCloned.subcategory_template_id;
                                delete subcategoryCloned.category_template_id;

                                return {
                                    ...subcategoryCloned,
                                };
                            }),
                        },
                    };
                }),
            },
        },
    });

    if (!budget) {
        return {
            success: false,
            status: HTTP_STATUS.serverError,
            message: 'An error occured while creating new budget',
        };
    }

    return budget;
};

const updateBudget = async (userId, budgetId, budgetData) => {
    const budget = await prisma.budgets.findFirst({
        where: { budget_id: parseInt(budgetId), user_id: userId },
    });

    if (!budget) {
        return {
            success: false,
            status: HTTP_STATUS.notFound,
            message: 'Budget not found',
        };
    }

    const updatedBudget = await prisma.budgets.update({
        where: { budget_id: parseInt(budgetId) },
        data: {
            ...budgetData,
        },
    });

    if (!updatedBudget) {
        return {
            success: false,
            status: HTTP_STATUS.serverError,
            message: 'An error occured while creating new budget',
        };
    }

    return updatedBudget;
};

const deleteBudget = async (userId, budgetId) => {
    const budget = await prisma.budgets.findFirst({
        where: { user_id: userId, budget_id: parseInt(budgetId) },
    });

    if (!budget) {
        return {
            success: false,
            status: HTTP_STATUS.notFound,
            message: 'Budget not found',
        };
    }

    try {
        const row = await prisma.budgets.delete({
            where: { budget_id: parseInt(budgetId) },
        });

        if (row) {
            return row;
        }
    } catch {
        return {
            success: false,
            status: HTTP_STATUS.serverError,
            message: 'An error occured while creating new budget',
        };
    }
};

export default {
    getBudgets,
    getBudget,
    addBudget,
    updateBudget,
    deleteBudget,
};
