const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

//middleware to generate JWT token
const generateJWTToken = (req, res, next ) => {
    const { userId, role } = req.body;

    if(!userId || !role ) {
        return res.status(400).json({message: "Missing userId and Role for token generation."});
    }

    try {
        //Create JWT payload
        const payload = { userId, role};

        //Generate JWT Token
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

        //Attach token to the request.
        req.token = token;
        next();
    } catch (error) {
        res.status(500).json({message: "Error generating token", error});
    }
};

module.exports = generateJWTToken;