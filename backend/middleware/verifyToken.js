const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
    console.log("Received Token:", token);
    if(!token) return res.status(401).json({success: false, message: "Unauthorized - no token provided."});
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);

        if(!decoded) return res.status(401).json({success: false, message: "Unauthorized - invalid token."})

            userId = req.user_id;
            console.log(userId);
        req.userId = decoded.id;
        console.log(req.userId);
        next();
    }catch(error) {
        console.log("Error in verifyingToken", error);
        return res.status(500).json({success: false, message: "server error"});
    }
}

module.exports = verifyToken;