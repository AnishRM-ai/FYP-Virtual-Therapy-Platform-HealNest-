// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken  = require('../middleware/verifyToken');
const { 
    initiateSessionPayment, 
    verifyAndCompletePayment, 
    checkPayment,
    refundSessionPayment
} = require('../controllers/paymentController');

// Initiate payment for a session
router.post('/initiate', verifyToken, initiateSessionPayment);

// Verify payment and proceed
router.post('/verify', verifyToken, verifyAndCompletePayment);

// Check payment status
router.get('/status/:pidx', verifyToken, checkPayment);

// Refund a session payment
router.post('/refund/:sessionId', verifyToken, refundSessionPayment);

module.exports = router;