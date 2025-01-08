const express = require('express');
const {registerClient,
    login
} = require('../controllers/clientAuth');
const generateJWTToken = require('../middleware/jwtMiddleware');
const router = express.Router();

//Register routes.

//Routes for Client.
router.post('/client/register', registerClient );
router.post('/login', login, generateJWTToken, (req, res ) => {
    //send response with the token.
    
    res.status(200).json({
        message: "Login successful",
        token: req.token,
        
    });
});

//Routes for Therapist.
router.post('/therapist/register');


//Admin routes.
router.post('admin/register');


module.exports = router;