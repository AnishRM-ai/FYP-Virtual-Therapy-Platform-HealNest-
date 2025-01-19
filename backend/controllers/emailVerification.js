const verifyEmail = async (req, res) => {
    const { code, role } = req.body; // Include role in the request body
    try {
        // Validate role
        if (!['client', 'therapist', 'admin'].includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role provided." });
        }

        // Determine the correct model based on role
        let UserModel;
        if (role === 'client') {
            UserModel = require('../models/clientdb'); // Replace with the actual client model path
        } else if (role === 'therapist') {
            UserModel = require('../models/therapistDB'); // Replace with the actual therapist model path
        } else if (role === 'admin') {
            UserModel = require('../models/admindb'); // Replace with the actual admin model path
        }

        // Find user with matching verification token and expiration time
        const user = await UserModel.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code." });
        }

        // Update user's verification status
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        res.status(200).json({ success: true, message: "Email verified successfully." });
    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).json({ success: false, message: "An error occurred during email verification." });
    }
};

module.exports = verifyEmail;