const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

const signup = async (req, res) => {
    try {
        const { name, email, password, role, requestedRole, adminRequestReason } = req.body;

        // Debug logging
        console.log('Signup request body:', { name, email, requestedRole, adminRequestReason });

        // 1. User already irukara-nu check panrom
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ status: "fail", message: "User already exists" });
        }

        // 2. Password Hash panrom
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create User (Default-ah isActive: false nu poyidum)
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'USER',
                requestedRole: requestedRole || 'USER',
                adminRequestReason: adminRequestReason || null,
                isActive: false // Signup pannum bodhu access irukaadhu
            }
        });

        console.log('User created:', { id: user.id, requestedRole: user.requestedRole, adminRequestReason: user.adminRequestReason });

        res.status(201).json({
            status: "success",
            message: "Signup success! Wait for admin approval.",
            data: { id: user.id, email: user.email, isActive: user.isActive }
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// --- LOGIN LOGIC ---
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const user = await prisma.user.findUnique({ where: { email } });

        if (user && (await bcrypt.compare(password, user.password))) {

            // 2. IMPORTANT: CHECK IF ACCOUNT IS ACTIVE
            if (user.isActive === false) {
                return res.status(403).json({
                    status: "fail",
                    message: "Your account is not active. Wait for admin approval."
                });
            }

            // 3. Active-ah irundha Token kuduthu login panna vidu
            res.json({
                status: "success",
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user.id)
                }
            });
        } else {
            res.status(401).json({ status: "fail", message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// --- REQUEST ADMIN TOKEN ---
const requestAdminToken = async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user.id; // From protect middleware

        if (!password) {
            return res.status(400).json({
                status: "fail",
                message: "Password is required to generate admin token"
            });
        }

        // Verify user exists and password is correct
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid password"
            });
        }

        // Verify user is an admin
        if (user.role !== 'ADMIN') {
            return res.status(403).json({
                status: "fail",
                message: "Only admins can request admin tokens"
            });
        }

        // Generate admin token
        const generateAdminToken = require('../utils/generateAdminToken');
        const adminToken = generateAdminToken(userId);

        res.json({
            status: "success",
            message: "Admin token generated successfully",
            data: {
                adminToken,
                expiresIn: "15m"
            }
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
};

module.exports = { signup, login, requestAdminToken };