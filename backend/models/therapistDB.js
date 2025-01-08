const mongoose = require('mongoose');
const User = require("./userBase");

const therapistSchema = new mongoose.Schema({
    qualificationProof: {
        type: String,
        required: true
    },
    isTherapistVerified:{
        type: Boolean,
        default: false
    },
    sessionHistory: [{
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client'
        },
        sessionDate: Date,
        sessionNotes: String
    }],
    feedbacks: [
        {
            clientId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Client'
            },
            rating: {
                type: Number,
                min: 1,
                max: 5
            },
            comment: String,
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    paymentStatements: [
        {
            amount: Number,
            date: {
                type: Date, 
                default: Date.now
            },
            clientId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Client'
            }
        }
    ]
});

const Therapist = User.discriminator('Therapist', therapistSchema);
module.exports = Therapist