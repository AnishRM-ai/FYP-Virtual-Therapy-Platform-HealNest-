const Feedback = require('../models/feedback');
const Session = require('../models/session');

// Create feedback
exports.createFeedback = async (req, res) => {
    try {
        const { sessionId, rating, comment } = req.body;
        const clientId = req.userId; 
        
        // Check if session exists and belongs to the client
        const session = await Session.findOne({ _id: sessionId, clientId });
        if (!session) {
            return res.status(404).json({ message: 'Session not found or not authorized' });
        }
        
        // Prevent duplicate feedback
        const existingFeedback = await Feedback.findOne({ sessionId });
        if (existingFeedback) {
            return res.status(400).json({ message: 'Feedback already submitted for this session' });
        }
        
        const feedback = new Feedback({
            sessionId,
            therapistId: session.therapistId,
            clientId,
            rating,
            comment
        });
        await feedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get feedback for a therapist
exports.getTherapistFeedback = async (req, res) => {
    try {
        const { therapistId } = req.params;
        const feedback = await Feedback.find({ therapistId }).sort({ givenAt: -1 });
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get feedback by session ID
exports.getSessionFeedback = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const feedback = await Feedback.findOne({ sessionId });
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
