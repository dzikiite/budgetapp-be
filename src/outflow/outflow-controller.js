import outflowService from './outflow-service.js';

export const addOutflowController = async (req, res) => {
    const { userId, body: outflowData } = req;
    const { budgetId, subcategoryId } = req.params;

    const userAuthorized = await outflowService.verifyOutflowUser(
        budgetId,
        subcategoryId,
        userId
    );

    if (userAuthorized?.success === false) {
        return res.status(userAuthorized.status).json(userAuthorized);
    }

    const outflow = await outflowService.addOutflow(
        budgetId,
        subcategoryId,
        outflowData
    );

    if (outflow?.success === false) {
        return res.status(outflow.status).json(outflow);
    }

    res.json({ success: true, outflow });
};

export const getOutflowsController = async (req, res) => {
    const { userId } = req;
    const { budgetId, subcategoryId } = req.params;

    const userAuthorized = await outflowService.verifyOutflowUser(
        budgetId,
        subcategoryId,
        userId
    );

    if (userAuthorized?.success === false) {
        return res.status(userAuthorized.status).json(userAuthorized);
    }

    const outflows = await outflowService.getOutflows(budgetId, subcategoryId);

    if (outflows?.success === false) {
        return res.status(outflows.status).json(outflows);
    }

    return res.json({
        success: true,
        outflows,
    });
};

export const updateOutflowController = async (req, res) => {
    const { userId, body: outflowNewData } = req;
    const { outflowId } = req.params;

    const outflow = await outflowService.updateOutflow(
        outflowId,
        outflowNewData,
        userId
    );

    if (outflow?.success === false) {
        return res.status(outflow.status).json(outflow);
    }

    return res.json({ success: true, outflow });
};

export const deleteOutflowController = async (req, res) => {
    const { userId } = req;
    const { outflowId } = req.params;

    const outflow = await outflowService.deleteOutflow(outflowId, userId);

    if (outflow?.success === false) {
        return res.status(outflow.status).json(outflow);
    }

    return res.json({
        success: true,
        outflow,
    });
};
