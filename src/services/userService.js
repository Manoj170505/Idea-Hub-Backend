const prisma = require('../config/db');
const { sendApprovalMail, sendRejectionMail } = require('../utils/mailSender');
const hashPassword = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken')
const bcrypt = require('bcrypt');

const createUser = async (userData) => {
    const hashedPassword = await hashPassword(userData.password);

    return await prisma.user.create({
        data: {
            email: userData.email,
            name: userData.name,
            password: hashedPassword,
            role: userData.role || 'USER',
            requestedRole: userData.requestedRole || 'USER',
            adminRequestReason: userData.adminRequestReason || null
        }
    })
}

const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({
        where: { email: email }
    });

    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new Error('Invalid credentials');
    }

    const token = generateToken(user.id);

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        }
    };
};

const approveUserAccount = async (userId, role = 'USER') => {
    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            isActive: true,
            role: role // Set the role (USER or ADMIN)
        }
    });

    await sendApprovalMail(user.email, user.name, role);

    return user;
}

const rejectUser = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new Error('User not found');
    }

    await sendRejectionMail(user.email, user.name);

    // Delete the user from database
    await prisma.user.delete({
        where: { id: userId }
    });

    return { message: 'User rejected and removed successfully' };
}

const deleteUser = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Delete user's posts first (cascade)
    await prisma.post.deleteMany({
        where: { authorid: userId }
    });

    // Delete the user
    await prisma.user.delete({
        where: { id: userId }
    });

    return { message: 'User deleted successfully' };
}

const updateUserProfile = async (userId, updateData) => {

    const { password, email, ...allowedData } = updateData;

    return await prisma.user.update({
        where: { id: userId },
        data: allowedData,
        select: {
            id: true,
            name: true,
            email: true,
            description: true,
            role: true
        }
    });
};

const getSystemStats = async () => {
    const usersCount = await prisma.user.count();
    const postCount = await prisma.post.count();
    const pendingPost = await prisma.post.count({
        where: { state: 'Pending' }
    });

    return {
        totalUsers: usersCount,
        totalPosts: postCount,
        pendingApprovals: pendingPost
    }
}

const getUserById = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            profilePic: true,
            description: true,
            rating: true,
            role: true,
            isActive: true,
            createdAt: true,
            _count: {
                select: {
                    posts: true
                }
            }
        }
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
}

const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            profilePic: true,
            role: true,
            isActive: true,
            createdAt: true,
            _count: {
                select: {
                    posts: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

const getPendingUsers = async () => {
    return await prisma.user.findMany({
        where: { isActive: false },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            requestedRole: true,
            adminRequestReason: true,
            createdAt: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

module.exports = { createUser, loginUser, approveUserAccount, rejectUser, deleteUser, updateUserProfile, getSystemStats, getUserById, getAllUsers, getPendingUsers };

