import prisma from '../../prisma/prisma.js';
import { HTTP_STATUS } from '../../helpers/constants.js';

const addInflow = async (budgetId, inflowData) => {
    const { amount } = inflowData;

    const inflow = await prisma.inflows.create({
        data: {
            ...inflowData,
            amount: amount ? parseFloat(amount) : 0.0,
            budget_id: parseInt(budgetId),
        },
    });

    if (!inflow) {
        return {
            success: false,
            status: HTTP_STATUS.serverError,
            message: 'An error occurred',
        };
    }

    return inflow;
};

const getInflowsSum = async (budgetId) => {
    const inflowsSum = await prisma.inflows.aggregate({
        where: { budget_id: parseInt(budgetId) },
        _sum: { amount: true },
    });

    return inflowsSum._sum.amount;
};

const updateInflow = async (inflowId, budget, newData) => {
    const { amount } = newData;
    const { budget_id: budgetId, inflows } = budget;

    const inflowExistsInBudget = inflows.some(
        (inflow) => inflow.budget_id === budgetId
    );

    if (!inflowExistsInBudget) {
        return {
            success: false,
            status: HTTP_STATUS.badRequest,
            message: 'There is no inflow for specified budget',
        };
    }

    const updatedInflow = await prisma.inflows.update({
        where: {
            budget_inflow_id: parseInt(inflowId),
        },
        data: {
            ...newData,
            ...(amount && { amount: parseFloat(amount) }),
        },
    });

    if (!updatedInflow) {
        return {
            success: false,
            status: HTTP_STATUS.badRequest,
            message: 'There was a problem while updating your inflow',
        };
    }

    return updatedInflow;
};

const deleteInflow = async (inflowId, budget) => {
    const { budget_id: budgetId, inflows } = budget;

    const inflowExistsInBudget = inflows.some(
        (inflow) => inflow.budget_id === budgetId
    );

    if (!inflowExistsInBudget) {
        return {
            success: false,
            status: HTTP_STATUS.badRequest,
            message: 'There is no inflow for specified budget',
        };
    }

    const deletedInflow = await prisma.inflows.delete({
        where: { budget_inflow_id: parseInt(inflowId) },
    });

    if (!deletedInflow) {
        return {
            success: false,
            status: HTTP_STATUS.serverError,
            message: 'There was a problem while deleting your inflow',
        };
    }

    return deletedInflow;
};

export default {
    addInflow,
    getInflowsSum,
    updateInflow,
    deleteInflow,
};
