import outflowService from '../outflow/outflow-service.js';

export const calculateRestAmount = async (subcategories) => {
    if (!subcategories || !Array.isArray(subcategories)) {
        return null;
    }

    const subcategoriesWithRestAmount = [];

    for await (const subcategory of subcategories) {
        const subcategoryOutflow =
            await outflowService.getOutflowsSumBySubcategory(
                subcategory.subcategory_id
            );

        subcategoriesWithRestAmount.push({
            ...subcategory,
            rest_amount: subcategory.allocated_amount - subcategoryOutflow,
        });
    }

    return subcategoriesWithRestAmount;
};
