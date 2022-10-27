import userService from './user-service.js';
import { HTTP_STATUS } from '../../helpers/constants.js';

export const userControllerGet = async (req, res) => {
    const { userId } = req;

    const user = await userService.findUser({ user_id: userId });

    if (!user) {
        return res.status(HTTP_STATUS.notFound).json({
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

    const user = await userService.checkUserExists({ user_id: userId });

    if (!user) {
        return res.status(HTTP_STATUS.notFound).json({
            success: false,
            message: 'User not found',
        });
    }

    const updatedUser = await userService.updateUser(userNewData, userId);

    return res.json({
        success: true,
        user: updatedUser,
    });
};

export const userControllerDelete = async (req, res) => {
    // TODO: Validate password while account is deleting
    const { userId } = req;

    const user = await userService.checkUserExists({ user_id: userId });

    if (!user) {
        return res.status(HTTP_STATUS.notFound).json({
            success: false,
            message: 'User not found',
        });
    }

    try {
        const deletedRow = await userService.deleteUser(userId);

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

export const registerController = async (req, res) => {
    const { email } = req.body || {};

    const duplicate = await userService.checkUserExists({ email });

    if (duplicate) {
        res.status(HTTP_STATUS.badRequest).json({
            success: false,
            message: 'Email is already taken by another user',
        });
    }

    const user = await userService.register(req.body);

    // TODO: Exclude hashed password from response
    res.json({
        success: true,
        user,
    });
};

export const loginController = async (req, res) => {
    const user = await userService.login(req.body);

    if (!user) {
        return res.status(HTTP_STATUS.badRequest).json({
            success: false,
            message: 'Authentication failed',
        });
    }

    return res.json({
        success: true,
        token: user.token,
    });
};
