const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    oauthProvider: { type: String, enum: ['google', null], default: null },
    oauthId: { type: String, default: null },
    role: { type: String, required: true, enum: ['client', 'therapist'], default: 'client' },
    avatar: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiresAt: { type: Date },
    passwordResetToken: { type: String },
    passwordResetTokenExpiresAt: { type: Date},
    lastLogin: {type: Date},
},
{ timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;