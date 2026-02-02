const express = require('express');
const { protect, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const upload = require('../config/cloudinary');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', protect, userController.getMe);
router.get('/profile/:id', userController.getUserById);
router.patch('/update-me', protect, upload.single('profilePic'), userController.upateMe);

// Admin routes
router.get('/admin/stats', protect, isAdmin, userController.getStats);
router.get('/admin/all-users', protect, isAdmin, userController.getAllUsers);
router.get('/admin/pending-users', protect, isAdmin, userController.getPendingUsers);
router.patch('/admin/approve/:id', protect, isAdmin, userController.handleApprove);
router.patch('/admin/reject/:id', protect, isAdmin, userController.handleReject);
router.delete('/admin/delete/:id', protect, isAdmin, userController.handleDeleteUser);

module.exports = router;