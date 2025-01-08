const mongoose = require('mongoose');
const User = require("./userBase");

const clientSchema = new mongoose.Schema({
    moodTracker: [
        {
            mood: String, 
            timestamp: {
                type: Date,
                default: Date.now
            },
            description: String
        }
    ],

    journals: [
        {
            date: {
                type: Date, 
                default: Date.now
            },
            title: String,
            content: String
        }
    ],

    bookedSessions: [
        {
            therapistId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Therapist'
            },
            sessionDate: Date,
            sessionLink: String,
            status: {
                type: String,
                enum: ['scheduled', 'completed', 'cancelled'],
                default: 'scheduled'
            }
        }
    ]
});

const Client = User.discriminator('Client', clientSchema);
module.exports = Client;