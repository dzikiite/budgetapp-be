import OutflowModel from '../models/outflow.model.js';
import BudgetModel from '../models/budget.model.js';
import SubcategoryModel from '../models/subcategory.model.js';
import CategoryModel from '../models/category.model.js';
import UserModel from '../models/user.model.js';

import db from '../config/db.js';

export const outflowControllerPost = async (req, res) => {
    const { userId, body: newOutflowData } = req;
    const { budget_id, subcategory_id } = req.params;
    const { name, amount } = newOutflowData;

    const budget = await BudgetModel.findOne({ where: { budget_id } });

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

    const subcategory = await SubcategoryModel.findOne({
        where: { subcategory_id },
        include: [{ model: CategoryModel, include: [UserModel] }],
    });

    if (!subcategory) {
        return res.status(404).json({
            success: false,
            message: 'Subcategory not found',
        });
    }

    if (subcategory.category.user_id != userId) {
        return res.status(404).json({
            success: false,
            message: 'There is no subcategory assigned for the specified user',
        });
    }

    const outflow = OutflowModel.build({
        subcategory_id,
        budget_id,
        name,
        amount: amount ? parseFloat(amount) : 0.0,
    });

    await outflow.save();

    const outflows = await OutflowModel.findAll({
        where: { budget_id, subcategory_id },
        attributes: [[db.fn('sum', db.col('amount')), 'total_outflows_amount']],
    });

    console.log('outflows: ', JSON.stringify(outflows));

    res.json({
        success: true,
        outflow,
    });
};
