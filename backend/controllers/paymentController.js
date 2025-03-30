// controllers/paymentController.js
const Payment = require('../models/paymentModel');
const Session = require('../models/session');
const User = require('../models/User');
const { initiatePayment, verifyPayment, refundPayment, checkPaymentStatus } = require('../services/khaltiService');

// Initiate a payment for a therapy session
const initiateSessionPayment = async (req, res) => {
    try {
        const { therapistId, clientId, scheduledTime, duration, amount } = req.body;
        
        // Verify both users exist
        const therapist = await User.findById(therapistId).select('fullname email');
        const client = await User.findById(clientId).select('fullname email');
        
        if (!therapist || !client) {
            return res.status(404).json({ 
                success: false, 
                message: "Therapist or client not found." 
            });
        }
        
        // Create customer info object for Khalti
        const customerInfo = {
            name: client.fullname,
            email: client.email
        };
        
        // Create a unique product identity
        const productIdentity = `SESSION-${therapistId}-${clientId}-${Date.now()}`;
        const productName = `Therapy Session with ${therapist.fullname}`;
        
        // Initiate payment with Khalti
        const payment = await initiatePayment(
            amount, 
            productIdentity, 
            productName, 
            customerInfo
        );
        
        // Create payment record in database
        const newPayment = new Payment({
            therapistId,
            clientId,
            amount: amount,
            paymentMethod: 'khalti',
            status: 'pending',
            transactionId: payment.pidx,
            providerResponse: payment
        });
        
        await newPayment.save();
        
        // Return payment information to client
        res.status(200).json({
            success: true,
            message: 'Payment initiated successfully',
            payment: {
                id: newPayment._id,
                pidx: payment.pidx,
                paymentUrl: payment.paymentUrl,
                amount: amount
            }
        });
        
    } catch (error) {
        console.error('Error initiating payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error initiating payment',
            error: error.message
        });
    }
};

// Verify and complete a payment
const verifyAndCompletePayment = async (req, res) => {
    try {
        const { pidx, therapistId, clientId, scheduledTime, duration } = req.body;
        
        // Verify payment with Khalti
        const paymentVerification = await verifyPayment(pidx);
        
        if (paymentVerification.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed',
                status: paymentVerification.status
            });
        }
        
        // Update payment record in database
        const payment = await Payment.findOneAndUpdate(
            { transactionId: pidx },
            { 
                status: 'paid',
                providerResponse: paymentVerification
            },
            { new: true }
        );
        
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment record not found'
            });
        }
        
        // Payment is verified, now create session
        // This part will be handled by the createSession function
        // Return the pidx so createSession can use it
        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            payment: {
                id: payment._id,
                pidx: payment.transactionId,
                amount: payment.amount,
                status: payment.status
            }
        });
        
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying payment',
            error: error.message
        });
    }
};

// Check status of a payment
const checkPayment = async (req, res) => {
    try {
        const { pidx } = req.params;
        
        // Check payment status with Khalti
        const paymentStatus = await checkPaymentStatus(pidx);
        
        // Update payment record in database if status has changed
        if (paymentStatus.status === 'Completed' || paymentStatus.status === 'completed') {
            await Payment.findOneAndUpdate(
                { transactionId: pidx },
                { 
                    status: 'paid',
                    providerResponse: paymentStatus
                }
            );
        } else if (paymentStatus.status === 'Refunded' || paymentStatus.status === 'refunded') {
            await Payment.findOneAndUpdate(
                { transactionId: pidx },
                { 
                    status: 'refunded',
                    providerResponse: paymentStatus
                }
            );
        }
        
        res.status(200).json({
            success: true,
            status: paymentStatus.status,
            details: paymentStatus
        });
        
    } catch (error) {
        console.error('Error checking payment status:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking payment status',
            error: error.message
        });
    }
};

// Refund a payment (for cancelled sessions)
const refundSessionPayment = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { reason } = req.body;
        
        // Find session to get payment details
        const session = await Session.findById(sessionId);
        
        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }
        
        if (!session.payment || !session.payment.transactionId) {
            return res.status(400).json({
                success: false,
                message: 'No payment associated with this session'
            });
        }
        
        if (session.payment.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Cannot refund a payment that is not completed'
            });
        }
        
        // Refund payment with Khalti
        const refund = await refundPayment(
            session.payment.transactionId,
            session.payment.amount * 100, // Convert to paisa
            reason || 'Session cancelled'
        );
        
        // Update session payment status
        session.payment.status = 'refunded';
        await session.save();
        
        // Update payment record if it exists
        await Payment.findOneAndUpdate(
            { transactionId: session.payment.transactionId },
            { 
                status: 'refunded',
                providerResponse: refund
            }
        );
        
        res.status(200).json({
            success: true,
            message: 'Payment refunded successfully',
            refund: refund
        });
        
    } catch (error) {
        console.error('Error refunding payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error refunding payment',
            error: error.message
        });
    }
};

module.exports = {
    initiateSessionPayment,
    verifyAndCompletePayment,
    checkPayment,
    refundSessionPayment
};