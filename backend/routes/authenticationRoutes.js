const express = require('express');
const {registerUser,
    login, 
    forgotPassword,
logout,
resetPassword} = require('../controllers/userAuth');
const verifyEmail = require('../controllers/emailVerification');
const router = express.Router();

//Register routes.

//Routes for Client.
router.post('/register', registerUser );

//Routes for Therapist.



//Admin routes.
router.post('admin/register');




router.post("/verify-email", verifyEmail);
router.post('/login', login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


module.exports = router;