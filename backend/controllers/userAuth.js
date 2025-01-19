const bcrypt = require('bcrypt'); // For hashing passwords
const Therapist = require('../models/therapistDB');
const Admin = require('../models/admindb');
const Client = require('../models/clientdb');
const {sendVerificationEmail, sendPasswordResetEmail, sendResetSuccessEmail} = require('../mailtrap/sendEmail');
const User = require('../models/User');
const generateJWTToken = require('../middleware/jwtMiddleware');
const crypto = require('crypto');
const { DefaultSerializer } = require('v8');
const registerUser = async (req, res) => {
    const { username, fullname, email, password, oauthProvider, oauthId, role} = req.body;

    try {
        //Validate Role.
        if (!role || (role !== 'client' && role !== 'therapist')) {
            return res.status(400).json({ message: 'Invalid role. Role must be either "client" or "therapist".' });
        }

        // Check if the email already exists
        const existingUser =
            (role === 'client' ? await Client.findOne({ email }) : await Therapist.findOne({ email }));
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        // Check if the username already exists
        const existingUsername =
            (role === 'client' ? await Client.findOne({ username }) : await Therapist.findOne({ username }));
        if (existingUsername) {
            return res.status(400).json({ message: 'Username is already taken.' });
        }

        // Hash password for non-OAuth users
        let hashedPassword = null;
        if (!oauthProvider) {
            if (!password) {
                return res.status(400).json({ message: 'Password is required for non-OAuth users.' });
            }
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const verificationToken = oauthProvider ? null : Math.floor(100000 + Math.random() * 900000).toString();

        

        // Create user based on role.
        const userData = {
            username,
            fullname,
            email,
            password: hashedPassword, // Null for OAuth users
            oauthProvider: oauthProvider || null,
            oauthId: oauthId || null,
            role, // Force role to 'client' for security
            verificationToken,
            verificationTokenExpiresAt: oauthProvider? null :  Date.now() + 24 * 60 * 60 * 1000,// 24 hours
        };

        const newUser = role === "client"? new Client(userData) : new Therapist(userData)
        
        await newUser.save();

        if(!oauthProvider){
            await sendVerificationEmail(newUser.email, verificationToken);
        }
        // Exclude password from the response
        const userResponse = {
            username: newUser.username,
            fullname: newUser.fullname,
            email: newUser.email,
            role: newUser.role,
            createdAt: newUser.createdAt,
            verificationToken: newUser.verificationToken
        };

        res.status(201).json({ message: 'Registration successful!', user: userResponse });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred during registration.' });
    }
};

//Login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user in the User collection
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        // Generate JWT token
        req.body.userId = user._id;
        req.body.role = user.role;
        generateJWTToken(req, res, () => {
            // Update the last login time
            user.lastLogin = new Date();
            user.save()
                .then(() => {
                    // Exclude password from the response
                    const userResponse = {
                        username: user.username,
                        fullname: user.fullname,
                        email: user.email,
                        role: user.role,
                        createdAt: user.createdAt,
                        lastLogin: user.lastLogin
                    };

                    res.status(200).json({ success: true, message: 'Login successful!', user: userResponse });
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).json({ success: false, message: 'An error occurred while updating last login time.' });
                });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred during login.' });
    }
};








// Controller for logout
const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully.' });
};

//Logic for forgot Password.
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try{
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({success: false, message: "User not found" });
        }

        //Generate reset link
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //1hour

        user.passwordResetToken = resetToken;
        user.passwordResetTokenExpiresAt = resetTokenExpiresAt;

        await user.save();

        //send email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message:"Password reset link sent to your email"});
    } catch (error) {
        res.status(400).json({success: false, message:"failed to send reset link."});
    }
}

//Reset Password
const resetPassword = async ( req, res) => {
    try{
        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetTokenExpiresAt: { $gt: Date.now()},
        });

        if(!user){
            return res.status(400).json({ success:false, message:"Invalid or expired reset token"});
        }

        //update password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiresAt= undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);
        res.status(200).json({ success: true, message:"Password reset successfully"});

    } catch (error) {
        res.status(400).json({error, message:"password reset failed."});
    }

}


module.exports = {
    registerUser, // Unified registration handler
    login,        // Login handler
    logout,       // Logout handler
    forgotPassword, //forgot password
    resetPassword
};
