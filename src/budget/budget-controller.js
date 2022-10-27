import budgetService from './budget-service.js';

export const budgetsControllerGet = async (req, res) => {
    const { userId } = req;

    const budgets = await budgetService.getBudgets(userId);

    if (budgets?.success === false) {
        res.status(budgets.status).json(budgets);
    }

    return res.json({
        success: true,
        budgets,
    });
};

export const budgetsControllerPost = async (req, res) => {
    const { userId, body: newBudgetData } = req;

    const budget = await budgetService.addBudget(userId, newBudgetData);

    if (budget?.success === false) {
        res.status(budget.status).json(budget);
    }

    res.json({
        success: true,
        budget,
    });
};

export const budgetControllerUpdate = async (req, res) => {
    const { userId, body: budgetNewData } = req;
    const { id } = req.params;

    const budget = await budgetService.updateBudget(userId, id, budgetNewData);

    if (budget?.status === false) {
        return res.sendStatus(budget.status).json({
            success: false,
            message: 'Budget not found',
        });
    }

    return res.json({
        success: true,
        budget,
    });
};

export const budgetControllerDelete = async (req, res) => {
    const { userId } = req;
    const { id } = req.params;

    const budget = await budgetService.deleteBudget(userId, id);

    if (budget?.success === false) {
        return res.status(budget.status).json(budget);
    }

    return res.json({
        success: true,
        message: 'Budget deleted successfully',
    });
};
