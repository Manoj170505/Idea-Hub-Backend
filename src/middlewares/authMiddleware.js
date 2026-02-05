const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);


            req.user = await prisma.user.findUnique({
                where: {
                    id: decoded.userId
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            })

            next();
        } catch (error) {
            console.log("MiddleWare Error:", error.message);
            res.status(401).json({
                status: "fail",
                message: "Unauthorized, token failed"
            });
        }
    }

    if (!token) {
        res.status(401).json({
            status: "fail",
            message: "Unauthorized, token not found"
        });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({
            status: "fail",
            message: "Unauthorized, admin role required"
        });
    }
};

// Middleware to validate admin token for sensitive operations
const requireAdminToken = async (req, res, next) => {
    const adminToken = req.headers['x-admin-token'];

    if (!adminToken) {
        return res.status(403).json({
            status: "fail",
            message: "Admin token required for this operation"
        });
    }

    try {
        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);

        // Verify it's an admin token
        if (decoded.tokenType !== 'admin') {
            return res.status(403).json({
                status: "fail",
                message: "Invalid admin token"
            });
        }

        // Verify the admin token belongs to the authenticated user
        if (decoded.userId !== req.user.id) {
            return res.status(403).json({
                status: "fail",
                message: "Admin token does not match authenticated user"
            });
        }

        req.adminToken = decoded;
        next();
    } catch (error) {
        console.log("Admin Token Error:", error.message);
        res.status(401).json({
            status: "fail",
            message: "Invalid or expired admin token"
        });
    }
};

// Middleware to prevent admins from changing their own credentials
const preventSelfCredentialChange = (req, res, next) => {
    const targetUserId = req.params.id;

    // If admin is trying to modify their own account
    if (req.user.role === 'ADMIN' && req.user.id === targetUserId) {
        return res.status(403).json({
            status: "fail",
            message: "Admins cannot modify their own credentials. Please have another admin make this change."
        });
    }

    next();
};

module.exports = { protect, isAdmin, requireAdminToken, preventSelfCredentialChange };