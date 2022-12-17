import prisma from '../../prisma/prisma.js';
import { HTTP_STATUS } from '../../helpers/constants.js';

const verifyOutflowUser = async (budgetId, subcategoryId, userId) => {
    const user = await prisma.users.findUnique({
        where: { user_id: userId },
        include: {
            budgets: {
                include: {
                    categories: {
                        include: {
                            subcategories: true,
                        },
                    },
                },
            },
        },
    });

    const { budgets } = user;

    const isBudgetAndSubcategoryForSpecifedUser = budgets.categories.forEach(
        (category) =>
            category.subcategories.some(
                (subcategory) =>
                    subcategory.subcategory_id === parseInt(subcategoryId)
            )
    );

    if (!isBudgetAndSubcategoryForSpecifedUser) {
        return {
            success: false,
            status: HTTP_STATUS.badRequest,
            message: 'There is no budget or subcategory for specified user.',
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
    const subcategories = await prisma.subcategories.findFirst({
        where: {
            subcategory_id: parseInt(subcategoryId),
        },
        include: {
            outflows: true,
        },
    });

    const outflows = subcategories?.outflows;

    if (!outflows) {
        return {
            success: false,
            status: HTTP_STATUS.notFound,
            message: 'An unexpected error occured',
        };
    }

    return outflows;
};

const updateOutflow = async (outflowId, outflowNewData) => {
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

const deleteOutflow = async (outflowId) => {
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
    updateOutflow,
    deleteOutflow,
};
