const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    const oauthToken = req.cookies.oauthToken;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.id;
            next();
        } catch (error) {
            console.log("Error in verifying JWT token", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    } else if (oauthToken) {
        req.userId = req.session.passport.user; // Assuming passport stores the user ID in the session
        next();
    } else {
        return res.status(401).json({ success: false, message: "Unauthorized - no token provided." });
    }
};

module.exports = verifyToken;