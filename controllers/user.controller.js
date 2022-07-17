import UserModel from '../models/user.model.js';

export const userControllerGet = async (req, res) => {
    const { userId } = req;

    const userData = await UserModel.findOne({
        where: { user_id: userId },
        attributes: ['firstname', 'lastname', 'email', 'user_id'],
    });

    const user = userData?.get({ plain: true });

    if (!user) {
        return res.sendStatus(404).json({
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

    const user = await UserModel.findOne({ where: { user_id: userId } });

    if (!user) {
        return res.sendStatus(404).json({
            success: false,
            message: 'User not found',
        });
    }

    user.set({
        ...user,
        ...userNewData,
    });

    const updatedUser = await user.save();

    // TODO: Exclude token from response
    return res.json({
        success: true,
        user: updatedUser,
    });
};

export const userControllerDelete = async (req, res) => {
    // TODO: Validate password while account is deleting
    const { userId } = req;

    const user = await UserModel.findOne({ where: { user_id: userId } });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    try {
        const deletedRow = await user.destroy();

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
