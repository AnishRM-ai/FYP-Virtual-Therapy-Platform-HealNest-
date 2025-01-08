const mongoose = require('mongoose');

const therapistVerificationSchema = new mongoose.Schema({
    therapistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Therapist',
        required: true
    },
    proofDocument: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Assuming Admin is part of User model
    },
    reviewedAt: Date,
    feedback: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const TherapistVerification = mongoose.model('TherapistVerification', therapistVerificationSchema);
module.exports = TherapistVerification;
