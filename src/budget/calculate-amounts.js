import inflowService from '../inflow/inflow-service.js';
import outflowService from '../outflow/outflow-service.js';

export const calculateBudgetsAmounts = async (budgets) => {
    if (!budgets || !Array.isArray(budgets)) {
        return null;
    }

    const budgetsWithTotalAmount = [];

    for await (const budget of budgets) {
        const totalInflowsAmount = await inflowService.getInflowsSum(
            budget.budget_id
        );
        const totalOutflowsAmount = await outflowService.getOutflowsSumByBudget(
            budget.budget_id
        );

        budgetsWithTotalAmount.push({
            ...budget,
            total_amount: totalInflowsAmount,
            rest_amount: totalInflowsAmount - totalOutflowsAmount,
        });
    }

    return budgetsWithTotalAmount;
};
