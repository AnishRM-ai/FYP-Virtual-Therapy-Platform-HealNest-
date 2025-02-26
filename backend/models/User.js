const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname: {type:String},
    username: { type: String, required: false, unique: true, trim: true },
    gender:{type: String},
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    oauthProvider: { type: String, enum: ['google', null], default: null },
    oauthId: { type: String, default: null },
    role: { type: String, required: true, enum: ['client', 'therapist'] },
    avatar: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    isOnboarded: {type: Boolean, default: false},
    verificationToken: { type: String },
    verificationTokenExpiresAt: { type: Date },
    passwordResetToken: { type: String },
    passwordResetTokenExpiresAt: { type: Date},
    lastLogin: {type: Date},

    googleCalendarConnected: {type: Boolean, default: false},
},
{ timestamps: true });



const User = mongoose.model('User', userSchema);

module.exports = User;