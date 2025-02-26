const { default: mongoose } = require("mongoose");

const googleTokenSchema = new mongoose.Schema({
    userId:{ type: mongoose.Schema.Types.ObjectId, ref:'User', unique: true},
    access_token: String,
    refresh_token: String,
    expiry_date: Date
});

const GoogleToken = mongoose.model('GoogleToken', googleTokenSchema);