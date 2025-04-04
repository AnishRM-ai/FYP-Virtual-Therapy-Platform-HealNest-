const User = require('../models/User');
const bcrypt = require('bcrypt');

const updateProfile = async(req, res) => {
    try{
        const {fullname, bio, email, password} = req.body;
        const userId = req.userId;

        //check if user exist
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message:"User not found."});

        //validate email format.
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        //Check is email is already taken by another user.
        if(email && email !== user.email) {
            const existingUser = await User.findOne({email});
            if(existingUser) {
                return res.status(400).json({message:"Email is already taken."});
            }
        }

        const updateData = {};
        if(fullname) updateData.fullname = fullname;
        if(bio) updateData.bio = bio;
        if(email) updateData.email = email;
        //Handle password change
        if(password){
            if(password.length < 8){
                return res.status(400).json({message: "Password must be at least 8 character long"});
            }
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        //update user profile
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {$set: updateData},
            {new: true, runValidators: true}
        ).select('-password');
        
        res.status(200).json({
            success: true,
            message: "profile updated successfully.",
            user: updatedUser
        });
    }catch (error){
        console.error("Internal server error", error);
        res.status(500).json({success: false, message:"There was something wrong updating profile."});
    }
};

module.exports = {updateProfile};