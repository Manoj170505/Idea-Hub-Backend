const jwt = require('jsonwebtoken');

const generateAdminToken = (userId) => {
    return jwt.sign(
        {
            userId,
            tokenType: 'admin',
            issuedAt: Date.now()
        },
        process.env.JWT_SECRET,
        { expiresIn: '15m' } // Short expiry for security
    );
};

module.exports = generateAdminToken;
