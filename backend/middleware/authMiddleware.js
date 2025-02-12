const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization")?.split("")[1];

    if(!token){
        return res.status(401).json({success: false, message:"Access Denied. No token"});
    }
    try{
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.userId = decoded.id;
        // Fetch user details
        const user = await User.findById(req.userId).select("role");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.userRole = user.role;
        next();
    } catch (error) {
        res.status(401).json({success: false, message:"Invalid token"});
    }
};

module.exports = authMiddleware;