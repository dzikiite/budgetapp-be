import bcrypt from 'bcrypt';

import UserModel from '../models/user.model.js';
import { generateToken } from '../helpers/generateToken.js';

export const registerController = async (req, res) => {
    const { firstname, lastname, email, password } = req.body || {};

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const user = UserModel.build({
        firstname,
        lastname,
        email,
        password: passwordHash,
    });

    const duplicate = await UserModel.findOne({ where: { email } });

    if (duplicate) {
        res.status(400).json({
            success: false,
            message: 'Email is already taken by another user',
        });
    }

    await user.save();

    res.status(200).json({
        success: true,
        user,
    });
};

export const loginController = async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ where: { email } });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'Authentication failed (email)',
        });
    }

    if (await bcrypt.compare(password, user.password)) {
        const token = generateToken(JSON.stringify(user));

        user.token = token;

        await user.save();

        return res.status(200).json({
            success: true,
            token: user.token,
        });
    } else {
        return res.status(400).json({
            success: false,
            message: 'Authentication failed (password)',
        });
    }
};
