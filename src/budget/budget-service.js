import prisma from '../../prisma/prisma.js';
import { HTTP_STATUS } from '../../helpers/constants.js';

const getBudgets = async (userId) => {
    const budgets = await prisma.budgets.findMany({
        where: { user_id: userId },
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

    const budget = await prisma.budgets.create({
        data: {
            budget_name,
            total_amount: 0.0,
            rest_amount: 0.0,
            user_id: userId,
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
    addBudget,
    updateBudget,
    deleteBudget,
};
