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

module.exports = { protect, isAdmin };