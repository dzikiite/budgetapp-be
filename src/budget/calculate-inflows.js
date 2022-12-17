import inflowService from '../inflow/inflow-service.js';

export const calculateBudgetsInflows = async (budgets) => {
    if (!budgets || !Array.isArray(budgets)) {
        return null;
    }

    const budgetsWithTotalAmount = [];

    for await (const budget of budgets) {
        const totalInflowsAmount = await inflowService.getInflowsSum(
            budget.budget_id
        );

        budgetsWithTotalAmount.push({
            ...budget,
            total_amount: totalInflowsAmount ?? 0.0,
        });
    }

    return budgetsWithTotalAmount;
};
