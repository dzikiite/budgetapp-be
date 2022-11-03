import budgetService from '../budget/budget-service.js';
import inflowService from './inflow-service.js';

export const getInflowsController = async (req, res) => {
    const { userId } = req;
    const { id: budgetId } = req.params;

    const budget = await budgetService.getBudget(userId, budgetId);

    if (budget?.success === false) {
        return res.status(budget.status).json(budget);
    }

    return res.json({
        success: true,
        inflows: budget.inflows,
    });
};

export const addInflowController = async (req, res) => {
    const { userId, body: inflowData } = req;
    const { id: budgetId } = req.params;

    const budget = await budgetService.getBudget(userId, budgetId);

    if (budget?.success === false) {
        return res.status(budget.status).json(budget);
    }

    const inflow = await inflowService.addInflow(budgetId, inflowData);

    if (inflow?.success === false) {
        return res.status(inflow.status).json(inflow);
    }

    return res.json({ success: true, inflow });
};

export const updateInflowController = async (req, res) => {
    const { userId, body: inflowData } = req;
    const { id: budgetId, inflowId } = req.params;

    const budget = await budgetService.getBudget(userId, budgetId);

    if (budget?.success === false) {
        return res.status(budget.status).json(budget);
    }

    const updatedInflow = await inflowService.updateInflow(
        inflowId,
        budget,
        inflowData
    );

    if (updatedInflow?.success === false) {
        return res.status(updatedInflow.status).json(updatedInflow);
    }

    return res.json({
        success: true,
        inflow: updatedInflow,
    });
};

export const deleteInflowController = async (req, res) => {
    const { userId } = req;
    const { id: budgetId, inflowId } = req.params;

    const budget = await budgetService.getBudget(userId, budgetId);

    if (budget?.success === false) {
        return res.status(budget.status).json(budget);
    }

    const deletedInflow = await inflowService.deleteInflow(inflowId, budget);

    if (deletedInflow?.success === false) {
        return res.status(deletedInflow.status).json(deletedInflow);
    }

    return res.json({
        success: true,
        deletedInflow,
    });
};
