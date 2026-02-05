const express = require('express');
const { protect, isAdmin, requireAdminToken, preventSelfCredentialChange } = require('../middlewares/authMiddleware');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const upload = require('../config/cloudinary');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Request admin token (requires regular authentication)
router.post('/request-admin-token', protect, isAdmin, authController.requestAdminToken);

router.get('/me', protect, userController.getMe);
router.get('/profile/:id', userController.getUserById);

// Update profile - admin token required for credential changes
router.patch('/update-me', protect, (req, res, next) => {
    // Check if admin token is provided for sensitive changes
    const sensitiveFields = ['email', 'password', 'role'];
    const isSensitiveChange = sensitiveFields.some(field => req.body[field] !== undefined);

    if (isSensitiveChange && req.headers['x-admin-token']) {
        // If admin token is provided, validate it
        return requireAdminToken(req, res, next);
    }
    next();
}, upload.single('profilePic'), userController.upateMe);

// Admin routes - require admin token for user management
router.get('/admin/stats', protect, isAdmin, userController.getStats);
router.get('/admin/all-users', protect, isAdmin, userController.getAllUsers);
router.get('/admin/pending-users', protect, isAdmin, userController.getPendingUsers);

// User approval/rejection/deletion - require admin token and prevent self-modification
router.patch('/admin/approve/:id', protect, isAdmin, requireAdminToken, preventSelfCredentialChange, userController.handleApprove);
router.patch('/admin/reject/:id', protect, isAdmin, requireAdminToken, preventSelfCredentialChange, userController.handleReject);
router.delete('/admin/delete/:id', protect, isAdmin, requireAdminToken, preventSelfCredentialChange, userController.handleDeleteUser);

module.exports = router;