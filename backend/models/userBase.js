const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        select: false
    },
    oauthProvider: {
        type: String, 
        enum: ['google', null],
        default: null
    },
    oauthId:{
        type: String
    },
    fullname:{
        type: String
    },
    role:{
        type: String,
        enum: ['client', 'therapist', 'admin'],
        default: 'client'
    },
    avatar:{
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    lastActiveAt: {
        type: Date
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date

}, {timestamps:true});

const User = mongoose.model('User', userSchema);
module.exports = User;