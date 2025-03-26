const express = require('express');
const router = express.Router();
const {createFeedback, getTherapistFeedback, getSessionFeedback} = require('../controllers/feedback');
const authMiddleware = require('../middleware/verifyToken');

// Create feedback (only clients can submit feedback)
router.post('/create', authMiddleware, createFeedback);

// Get all feedback for a therapist
router.get('/therapist/:therapistId', getTherapistFeedback);

// Get feedback for a specific session
router.get('/session/:sessionId', getSessionFeedback);

module.exports = router;
