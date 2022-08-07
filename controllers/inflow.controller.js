import InflowModel from '../models/inflow.model.js';
import UserModel from '../models/inflow.model.js';
import BudgetModel from '../models/budget.model.js';

export const inflowsControllerGet = async (req, res) => {
    const { userId } = req;

    const budgetInflowsData = await BudgetModel.findAll({
        include: UserModel,
    });

    if (!budgetInflowsData) {
        return res.status(404).json({
            success: false,
            message: 'Inflows not found',
        });
    }

    const inflows = [];

    budgetInflowsData.forEach((budget) => {
        if (budget.user_id == userId) {
            inflows.push(...budget.inflows);
        }
    });

    return res.json({
        success: true,
        inflows,
    });
};

export const budgetInflowsControllerGet = async (req, res) => {
    const { userId } = req;
    const { id: budgetId } = req.params;

    const budgetData = await BudgetModel.findOne({
        where: { budget_id: budgetId },
    });

    const budget = budgetData?.get({ plain: true });

    if (!budget) {
        return res.status(404).json({
            success: false,
            message: 'Budget not found',
        });
    }

    if (budget.user_id != userId) {
        return res.status(404).json({
            success: false,
            message: 'There is no budget assigned for the specified user',
        });
    }

    const inflows = await InflowModel.findAll({
        where: { budget_id: budgetId },
    });

    if (!inflows) {
        return res.status(404).json({
            success: false,
            message: 'Inflows not found',
        });
    }

    return res.json({
        success: true,
        inflows,
    });
};

export const inflowControllerPost = async (req, res) => {
    const { userId, body: newInflowData } = req;
    const { name, amount } = newInflowData;
    const { id: budgetId } = req.params;

    const budget = BudgetModel.findOne({
        where: { budget_id: budgetId, user_id: userId },
    });

    if (!budget) {
        res.status(400).json({
            success: false,
            message: 'For a given user, there is no budget with the given ID',
        });
    }

    // TODO: Add validation for amount
    const inflow = InflowModel.build({
        budget_id: budgetId,
        name,
        amount: amount ? parseFloat(amount) : 0.0,
    });

    await inflow.save();

    res.json({
        success: true,
        inflow,
    });
};

export const inflowControllerUpdate = async (req, res) => {
    const { userId, body: inflowNewData } = req;
    const { id: budget_inflow_id } = req.params;

    const inflow = await InflowModel.findOne({
        where: { budget_inflow_id },
        include: [{ model: BudgetModel, include: [UserModel] }],
    });

    if (!inflow) {
        return res.status(404).json({
            success: false,
            message: 'Inflow not found',
        });
    }

    if (inflow.budget.user_id != userId) {
        return res.status(404).json({
            success: false,
            message: 'There is no inflow assigned for the specified user',
        });
    }

    if (inflowNewData?.amount && inflowNewData.amount != inflow.amount) {
        const amountDifference =
            (inflow.amount - parseInt(inflowNewData.amount)) * -1;

        const budget = await BudgetModel.findOne({
            where: { budget_id: inflow.budget_id },
        });

        if (!budget) {
            return res.json({
                success: false,
                message: 'An error occured',
            });
        }

        if (amountDifference > 0) {
            budget.increment({ total_amount: amountDifference });
        } else if (amountDifference < 0) {
            budget.decrement({ total_amount: amountDifference * -1 });
        } else {
            return res.json({
                success: false,
                message: 'An error occured',
            });
        }
    }

    inflow.set({
        ...inflow,
        ...inflowNewData,
    });

    const updatedInflow = await inflow.save();

    return res.json({
        success: true,
        updatedInflow,
    });
};

export const inflowControllerDelete = async (req, res) => {
    const { userId } = req;
    const { id: budget_inflow_id } = req.params;

    const inflow = await InflowModel.findOne({
        where: { budget_inflow_id },
        include: [{ model: BudgetModel, include: [UserModel] }],
    });

    if (!inflow) {
        return res.status(404).json({
            success: false,
            message: 'Inflow not found',
        });
    }

    if (inflow.budget.user_id != userId) {
        return res.status(404).json({
            success: false,
            message: 'There is no inflow assigned for the specified user',
        });
    }

    const inflowAmount = inflow.amount;
    const inflowBudgetId = inflow.budget.budget_id;

    try {
        const deletedRow = await inflow.destroy();

        if (deletedRow) {
            const budget = await BudgetModel.findOne({
                where: { budget_id: inflowBudgetId },
            });

            if (!budget) {
                return res.json({
                    success: false,
                    message: 'An error occured',
                });
            } else {
                budget.decrement({ total_amount: inflowAmount });

                return res.json({
                    success: true,
                    message: 'Inflow deleted successfully',
                });
            }
        }
    } catch (err) {
        console.log('Error: ', err);
        return res.json({
            success: false,
            message: 'An error occured',
        });
    }
};
