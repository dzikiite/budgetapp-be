import prisma from '../../prisma/prisma.js';
import { HTTP_STATUS } from '../../helpers/constants.js';

const verifyOutflowUser = async (budgetId, subcategoryId, userId) => {
    const user = await prisma.users.findUnique({
        where: { user_id: userId },
        include: {
            budgets: true,
            categories: {
                include: {
                    subcategories: true,
                },
            },
        },
    });

    const { budgets, categories } = user;

    const isBudgetForSpecifedUser = budgets.some(
        (budget) => budget.budget_id === parseInt(budgetId)
    );

    if (!isBudgetForSpecifedUser) {
        return {
            success: false,
            status: HTTP_STATUS.badRequest,
            message: 'There is no budget for specified user.',
        };
    }

    const isSubcategoryForSpecifedUser = categories.some((category) =>
        category.subcategories.some(
            (subcategory) =>
                subcategory.subcategory_id === parseInt(subcategoryId)
        )
    );

    if (!isSubcategoryForSpecifedUser) {
        return {
            success: false,
            status: HTTP_STATUS.badRequest,
            message: 'There is no subcategory for specified user.',
        };
    }

    return true;
};

const addOutflow = async (budgetId, subcategoryId, outflowData) => {
    const { amount } = outflowData;

    if (!amount) {
        return {
            success: false,
            status: HTTP_STATUS.badRequest,
            message: 'Amount is required field',
        };
    }

    const outflow = await prisma.outflows.create({
        data: {
            ...outflowData,
            amount: parseFloat(amount),
            budget_id: parseInt(budgetId),
            subcategory_id: parseInt(subcategoryId),
        },
    });

    if (!outflow) {
        return {
            success: false,
            status: HTTP_STATUS.serverError,
            message: 'There was a problem with adding new outflow',
        };
    }

    return outflow;
};

const getOutflows = async (budgetId, subcategoryId) => {
    const outflows = await prisma.outflows.findMany({
        where: {
            budget_id: parseInt(budgetId),
            subcategory_id: parseInt(subcategoryId),
        },
    });

    if (!outflows) {
        return {
            success: false,
            status: HTTP_STATUS.notFound,
            message: 'No outflows',
        };
    }

    return outflows;
};

const getOutflowsSumByBudget = async (budgetId) => {
    const outflowsSum = await prisma.outflows.aggregate({
        where: { budget_id: parseInt(budgetId) },
        _sum: { amount: true },
    });

    return outflowsSum._sum.amount;
};

const getOutflowsSumBySubcategory = async (subcategoryId) => {
    const outflowsSum = await prisma.outflows.aggregate({
        where: { subcategory_id: parseInt(subcategoryId) },
        _sum: { amount: true },
    });

    return outflowsSum._sum.amount;
};

const updateOutflow = async (outflowId, outflowNewData, userId) => {
    const outflow = await prisma.outflows.findFirst({
        where: { budget_outflow_id: parseInt(outflowId) },
        include: {
            subcategories: {
                include: {
                    categories: {
                        select: { user_id: true },
                    },
                },
            },
        },
    });

    const noOutflowResponse = {
        success: false,
        status: HTTP_STATUS.notFound,
        message: 'No outflow for specified id',
    };

    if (!outflow) {
        return noOutflowResponse;
    }

    if (outflow.subcategories.categories.user_id !== userId) {
        return noOutflowResponse;
    }

    const { allocated_amount } = outflowNewData;

    const updatedOutflow = await prisma.outflows.update({
        where: { budget_outflow_id: parseInt(outflowId) },
        data: {
            ...outflowNewData,
            allocated_amount: parseFloat(allocated_amount),
        },
    });

    if (!updatedOutflow) {
        return {
            success: false,
            status: HTTP_STATUS.serverError,
            message: 'There was an error while updating your outflow',
        };
    }

    return updatedOutflow;
};

const deleteOutflow = async (outflowId, userId) => {
    const outflow = await prisma.outflows.findFirst({
        where: { budget_outflow_id: parseInt(outflowId) },
        include: {
            subcategories: {
                include: {
                    categories: {
                        select: { user_id: true },
                    },
                },
            },
        },
    });

    const noOutflowResponse = {
        success: false,
        status: HTTP_STATUS.notFound,
        message: 'No outflow for specified id',
    };

    if (!outflow) {
        return noOutflowResponse;
    }

    if (outflow.subcategories.categories.user_id !== userId) {
        return noOutflowResponse;
    }

    const deletedOutflow = await prisma.outflows.delete({
        where: { budget_outflow_id: parseInt(outflowId) },
    });

    if (!deletedOutflow) {
        return {
            success: false,
            status: HTTP_STATUS.serverError,
            message: 'There was an error while updating your outflow',
        };
    }

    return deletedOutflow;
};

export default {
    verifyOutflowUser,
    addOutflow,
    getOutflows,
    getOutflowsSumByBudget,
    getOutflowsSumBySubcategory,
    updateOutflow,
    deleteOutflow,
};
