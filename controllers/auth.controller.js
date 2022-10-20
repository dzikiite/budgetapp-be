import bcrypt from 'bcrypt';

import prisma from '../prisma/prisma.js';
import { generateToken } from '../helpers/generateToken.js';

export const registerController = async (req, res) => {
    const { firstname, lastname, email, password } = req.body || {};

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const duplicate = await prisma.users.findUnique({ where: { email } });

    if (duplicate) {
        res.status(400).json({
            success: false,
            message: 'Email is already taken by another user',
        });
    }

    const user = await prisma.users.create({
        data: {
            firstname,
            lastname,
            email,
            password: passwordHash,
        },
    });

    // TODO: Exclude hashed password from response
    res.json({
        success: true,
        user,
    });
};

export const loginController = async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.users.findUnique({ where: { email: email } });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'Authentication failed (email)',
        });
    }

    if (await bcrypt.compare(password, user.password)) {
        const token = generateToken(JSON.stringify(user.user_id));

        const updatedUser = await prisma.users.update({
            where: { email },
            data: { token },
        });

        return res.json({
            success: true,
            token: updatedUser.token,
        });
    } else {
        return res.status(400).json({
            success: false,
            message: 'Authentication failed (password)',
        });
    }
};
