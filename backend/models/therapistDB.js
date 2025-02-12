const mongoose = require('mongoose');
const User = require('../models/User')
const therapistSchema = new mongoose.Schema(
    {
        qualificationProof: {
            type: [String],
            default: null, // Default as null to clarify it can be empty
        },
        isTherapistVerified: {
            type: Boolean,
            default: false,
        },
            specializations: [{
                type: String,
                enum: ['depression', 'anxiety', 'relationship', 'trauma', ]
            }],
            education: [{
                degree: String,
                institution: String,
                year: Number
            }],
            availability: [{
                day: {
                    type: String,
                    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                },
                slots: [{
                    startTime: String,
                    endTime: String,
                    isBooked: Boolean
                }]
            }],
            sessionPrice: {
                type: Number
            },
            languages: [{
                type: String
            }],
        
        sessionHistory: [
            {
                clientId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Client',
                },
                sessionDate: {
                    type: Date,
                },
                sessionNotes: {
                    type: String,
                    trim: true,
                },
            },
        ],
        paymentDetails: {
            provider: {
                type: String,
                enum: ['Stripe', 'Paypal'],
            },
            customerId: {
                type: String,
            }
        },
        
        feedbacks: [
            {
                clientId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Client',
                },
                rating: {
                    type: Number,
                    min: 1,
                    max: 5,
                },
                comment: {
                    type: String,
                    trim: true,
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        paymentStatements: [
            {
                amount: {
                    type: Number,
                    required: true,
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
                clientId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Client',
                },
            },
        ],
    }
);

const Therapist = User.discriminator('Therapist', therapistSchema)
module.exports = Therapist;
