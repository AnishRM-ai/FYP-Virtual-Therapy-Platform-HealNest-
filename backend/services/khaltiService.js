// services/khaltiService.js
const axios = require('axios');

// Khalti API configuration
const KHALTI_BASE_URL = process.env.KHALTI_BASE_URL || 'https://khalti.com/api/v2';
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;

// Verify payment with Khalti
const verifyPayment = async (pidx) => {
    try {
        const response = await axios.post(
            `${KHALTI_BASE_URL}/payment/verify/`, 
            { pidx },
            {
                headers: {
                    'Authorization': `Key ${KHALTI_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return {
            status: 'completed',
            amount: response.data.amount,
            transaction_id: response.data.idx,
            user: response.data.user,
            ...response.data
        };
    } catch (error) {
        console.error('Payment verification failed:', error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || 'Payment verification failed');
    }
};

// Refund payment with Khalti
const refundPayment = async (pidx, amount, remarks) => {
    try {
        const response = await axios.post(
            `${KHALTI_BASE_URL}/payment/refund/`,
            {
                pidx,
                amount,
                remarks: remarks || 'Session cancelled'
            },
            {
                headers: {
                    'Authorization': `Key ${KHALTI_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return {
            status: 'refunded',
            refundId: response.data.refund_idx,
            ...response.data
        };
    } catch (error) {
        console.error('Payment refund failed:', error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || 'Payment refund failed');
    }
};

// Initiate payment with Khalti
const initiatePayment = async (amount, productIdentity, productName, customerInfo) => {
    try {
        const response = await axios.post(
            `${KHALTI_BASE_URL}/payment/initiate/`,
            {
                amount: amount * 100, // Khalti expects amount in paisa
                product_identity: productIdentity,
                product_name: productName,
                customer_info: customerInfo,
                purchase_order_id: `SESSION-${Date.now()}`,
                website_url: process.env.WEBSITE_URL || 'https://yourdomain.com'
            },
            {
                headers: {
                    'Authorization': `Key ${KHALTI_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return {
            status: 'initiated',
            paymentUrl: response.data.payment_url,
            pidx: response.data.pidx,
            ...response.data
        };
    } catch (error) {
        console.error('Payment initiation failed:', error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || 'Payment initiation failed');
    }
};

// Check payment status with Khalti
const checkPaymentStatus = async (pidx) => {
    try {
        const response = await axios.get(
            `${KHALTI_BASE_URL}/payment/status/?pidx=${pidx}`,
            {
                headers: {
                    'Authorization': `Key ${KHALTI_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return {
            status: response.data.status,
            ...response.data
        };
    } catch (error) {
        console.error('Payment status check failed:', error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || 'Payment status check failed');
    }
};

module.exports = {
    verifyPayment,
    refundPayment,
    initiatePayment,
    checkPaymentStatus
};