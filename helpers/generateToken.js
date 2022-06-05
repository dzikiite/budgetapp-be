import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    // TODO: Work on remember me feature
    const token = jwt.sign(user, process.env.JWT_SECRET);

    return token;
};
