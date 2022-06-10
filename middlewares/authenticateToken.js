import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (!user) {
        return res.sendStatus(400).json({
            success: false,
            message: 'Something is wrong with token data',
        });
    }

    req.userId = user;

    next();
};
