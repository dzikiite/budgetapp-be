import BudgetModel from '../models/budget.model.js';

export const budgetsControllerGet = async (req, res) => {
    const { userId } = req;

    const budgetsData = await BudgetModel.findAll({
        where: { user_id: userId },
    });

    if (!budgetsData) {
        return res.sendStatus(404).json({
            success: false,
            message: 'Budgets not found',
        });
    }

    return res.json({
        success: true,
        budgetsData,
    });
};

export const budgetsControllerPost = async (req, res) => {
    const { userId, body: newBudgetData } = req;
    const { budget_name } = newBudgetData;

    const duplicate = await BudgetModel.findOne({
        where: { user_id: userId, budget_name },
    });

    if (duplicate) {
        res.status(400).json({
            success: false,
            message: 'There is a budget with the same name',
        });
    }

    const budget = BudgetModel.build({
        budget_name,
        total_amount: 0.0,
        rest_amount: 0.0,
        user_id: userId,
    });

    await budget.save();

    res.json({
        success: true,
        budget,
    });
};

export const budgetControllerUpdate = async (req, res) => {
    const { userId, body: budgetNewData } = req;
    const { id } = req.params;

    const budget = await BudgetModel.findOne({
        where: { budget_id: id, user_id: userId },
    });

    if (!budget) {
        return res.sendStatus(404).json({
            success: false,
            message: 'Budget not found',
        });
    }

    budget.set({
        ...budget,
        ...budgetNewData,
    });

    const updatedBudget = await budget.save();

    return res.json({
        success: true,
        budget: updatedBudget,
    });
};

export const budgetControllerDelete = async (req, res) => {
    const { userId } = req;
    const { id } = req.params;

    const budget = await BudgetModel.findOne({
        where: { user_id: userId, budget_id: id },
    });

    if (!budget) {
        return res.sendStatus(404).json({
            success: false,
            message: 'Budget not found',
        });
    }

    try {
        const deletedRow = await budget.destroy();

        if (deletedRow) {
            return res.json({
                success: true,
                message: 'Budget deleted successfully',
            });
        }
    } catch (err) {
        console.log('Error: ', err);

        return res.json({
            success: false,
            message: 'An error occurred',
        });
    }
};
