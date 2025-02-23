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
                enum: ['Depression', 'Anxiety', 'Relationship', 'Trauma', ]
            }],
            education: [{
                degree: String,
                institution: String,
                year: Number
            }],
            availability: [
                {
                    date: {
                        type: String,
                        format: "date" // ISO 8601 date format (YYYY-MM-DD)
                    },
                    slots: [
                        {
                            startTime: {
                                type: String,
                                format: "date-time" // ISO 8601 date-time format (YYYY-MM-DDTHH:MM:SSZ)
                            },
                            endTime: {
                                type: String,
                                format: "date-time" // ISO 8601 date-time format (YYYY-MM-DDTHH:MM:SSZ)
                            },
                            isBooked: {
                                type: Boolean
                            }
                        }
                    ]
                }
            ],
            
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
