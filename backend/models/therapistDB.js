const mongoose = require('mongoose');
const User = require('../models/User')
const therapistSchema = new mongoose.Schema(
    {
        qualificationProof: {
           resume:{
            type: String,
           },
           professionalLicense: {
            type: String,
           },
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
                enum: ['Khalti', 'Esewa'],
            },
            customerId: {
                type: String,
            }
        },
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
