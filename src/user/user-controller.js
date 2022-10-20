import prisma from '../../prisma/prisma.js';

export const userControllerGet = async (req, res) => {
    const { userId } = req;

    const user = await prisma.users.findUnique({
        where: { user_id: userId },
        select: { firstname: true, lastname: true, email: true, user_id: true },
    });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    return res.json({
        success: true,
        user,
    });
};

export const userControllerUpdate = async (req, res) => {
    const { userId, body: userNewData } = req;

    const user = await prisma.users.findUnique({ where: { user_id: userId } });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    const updatedUser = await prisma.users.update({
        where: { user_id: userId },
        data: {
            ...user,
            ...userNewData,
        },
        select: { firstname: true, lastname: true, email: true, user_id: true },
    });

    return res.json({
        success: true,
        user: updatedUser,
    });
};

export const userControllerDelete = async (req, res) => {
    // TODO: Validate password while account is deleting
    const { userId } = req;

    const user = await prisma.users.findUnique({ where: { user_id: userId } });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    try {
        const deletedRow = await prisma.users.delete({
            where: { user_id: userId },
        });

        if (deletedRow) {
            return res.json({
                success: true,
                message: 'User deleted successfully',
            });
        }
    } catch (err) {
        console.log('Error: ', err);

        return res.json({
            success: false,
            message: 'An error occured',
        });
    }
};
