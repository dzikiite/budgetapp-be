import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import prisma from '../../prisma/prisma.js';

const verifyUserByToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

const checkUserExists = async (userData) => {
    const user = await prisma.users.findUnique({
        where: userData,
        select: { user_id: true },
    });

    return !!user;
};

const findUser = async (userData) => {
    const user = await prisma.users.findUnique({
        where: userData,
        select: { firstname: true, lastname: true, email: true, user_id: true },
    });

    return user;
};

const updateUser = async (newData, userId) => {
    const updatedUser = await prisma.users.update({
        where: { user_id: userId },
        data: {
            ...newData,
        },
        select: { firstname: true, lastname: true, email: true, user_id: true },
    });

    return updatedUser;
};

const deleteUser = async (userId) => {
    const deletedUser = await prisma.users.delete({
        where: { user_id: userId },
    });

    return deletedUser;
};

const register = async (userData) => {
    const { firstname, lastname, email, password } = userData;

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser = await prisma.users.create({
        data: {
            firstname,
            lastname,
            email,
            password: passwordHash,
        },
    });

    if (!newUser) {
        return newUser;
    }

    const user = await login(userData);

    return user;
};

const login = async (userData) => {
    const { email, password } = userData;

    const user = await prisma.users.findUnique({
        where: { email },
    });

    if (!user) {
        return null;
    }

    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
            { userId: JSON.stringify(user.user_id) },
            process.env.JWT_SECRET,
            { expiresIn: '10800s' }
        );

        const updatedUser = await prisma.users.update({
            where: { email },
            data: { token },
        });

        return updatedUser;
    } else {
        return null;
    }
};

export default {
    verifyUserByToken,
    checkUserExists,
    findUser,
    updateUser,
    deleteUser,
    register,
    login,
};
