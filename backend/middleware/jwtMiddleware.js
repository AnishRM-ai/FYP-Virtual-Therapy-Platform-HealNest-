const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to generate JWT token and include it in cookies
const generateJWTToken = (req, res, next) => {
    const { userId, role } = req.body;

    if (!userId || !role) {
        return res.status(400).json({ message: "Missing userId and Role for token generation." });
    }

    try {
        // Create JWT payload
        const payload = { userId, role };

        // Generate JWT Token
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

        // Attach token to the request
        req.token = token;

        // Set the token as a cookie (httpOnly to prevent client-side access)
        res.cookie('token', token, {
            httpOnly: true,         // Prevents JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Ensures cookie is sent over HTTPS in production
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'Strict',     // Helps prevent CSRF attacks
        });

        next();
    } catch (error) {
        res.status(500).json({ message: "Error generating token", error });
    }
};

module.exports = generateJWTToken;
