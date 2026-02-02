const userService = require('../services/userService');
const { approveUserAccount, rejectUser: rejectUserService, deleteUser: deleteUserService } = require('../services/userService');

const handleApprove = async (req, res) => {
    try {
        const userId = req.params.id;
        const { role } = req.body; // Get role from request body
        const updatedUser = await approveUserAccount(userId, role);

        res.status(200).json({
            status: "success",
            message: "user approved successfully",
            data: updatedUser
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        })
    }
}

const upateMe = async (req, res) => {
    try {
        let updatedData = { ...req.body };
        if (req.file) {
            updatedData.profilePic = req.file.path;
        }

        const updatedUser = await userService.updateUserProfile(req.user.id, updatedData);
        res.status(200).json({
            status: "success",
            message: "user updated successfully",
            data: updatedUser
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        })
    }
}

const getStats = async (req, res) => {
    try {
        const stats = await userService.getSystemStats();
        res.status(200).json({
            status: "success",
            message: "stats fetched successfully",
            data: stats
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        })
    }
}

const getMe = async (req, res) => {
    try {
        const user = await userService.getUserById(req.user.id);
        res.status(200).json({
            status: "success",
            data: user
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
}

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userService.getUserById(userId);
        res.status(200).json({
            status: "success",
            data: user
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({
            status: "success",
            data: users
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
}

const getPendingUsers = async (req, res) => {
    try {
        const users = await userService.getPendingUsers();
        res.status(200).json({
            status: "success",
            data: users
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
}

const handleReject = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await rejectUserService(userId);

        res.status(200).json({
            status: "success",
            message: result.message
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        })
    }
}

const handleDeleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await deleteUserService(userId);

        res.status(200).json({
            status: "success",
            message: result.message
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        })
    }
}

module.exports = { handleApprove, handleReject, handleDeleteUser, upateMe, getStats, getMe, getUserById, getAllUsers, getPendingUsers };