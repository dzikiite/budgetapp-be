import userService from '../src/user/user-service.js';
import { HTTP_STATUS } from '../helpers/constants.js';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(HTTP_STATUS.unauthorized);
    }

    const user = userService.verifyUserByToken(token);

    if (!user) {
        return res.sendStatus(HTTP_STATUS.badRequest).json({
            success: false,
            message: 'Something is wrong with token data',
        });
    }

    req.userId = parseInt(user.userId);

    next();
};
