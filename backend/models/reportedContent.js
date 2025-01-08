const mongoose = require('mongoose');

const reportedContentSchema = new mongoose.Schema({
    contentId: {
        type: mongoose.Schema.Types.ObjectId, // Can reference posts or comments
        required: true
    },
    contentType: {
        type: String,
        enum: ['Post', 'Comment'],
        required: true
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: String,
    status: {
        type: String,
        enum: ['Pending', 'Reviewed'],
        default: 'Pending'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Admin reference
    },
    actionTaken: {
        type: String,
        enum: ['None', 'Deleted', 'User Banned'],
        default: 'None'
    },
    reviewedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ReportedContent = mongoose.model('ReportedContent', reportedContentSchema);
module.exports = ReportedContent;
