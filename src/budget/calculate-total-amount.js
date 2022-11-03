import inflowService from '../inflow/inflow-service.js';

export const calculateBudgetsTotalAmount = async (budgets) => {
    if (!budgets || !Array.isArray(budgets)) {
        return null;
    }

    const budgetsWithTotalAmount = [];

    for await (const budget of budgets) {
        const totalAmount = await inflowService.getInflowsSum(budget.budget_id);

        budgetsWithTotalAmount.push({
            ...budget,
            total_amount: totalAmount,
        });
    }

    return budgetsWithTotalAmount;
};
