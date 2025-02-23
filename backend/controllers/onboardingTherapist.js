const Therapist = require('../models/therapistDB');
const User = require('../models/User');
const upload = require('../middleware/multerConfig');


const onboardTherapist = async (req, res) => {
    try {
        if (!req.files) {
            return res.status(400).json({ success: false, message: "Please submit your valid document." });
        }

        const userId = req.userId;
        const therapist = await User.findById(userId);

        if (!therapist || therapist.role !== "therapist") {
            return res.status(404).json({ success: false, message: "Therapist user not found." });
        }

        if (!therapist.isVerified) {
            return res.status(400).json({ success: false, message: "Please verify your email." }); 
        }

        // Convert uploaded files to paths
        const filePaths = req.files.map(file => file.path);

        // Parse JSON fields
        const specializations = JSON.parse(req.body.specializations);
        const education = JSON.parse(req.body.education);
        const availability = JSON.parse(req.body.availability);
        const sessionPrice = Number(req.body.sessionPrice);
        const languages = JSON.parse(req.body.languages);

        // Update Therapist Model
        therapist.qualificationProof = filePaths;
        therapist.specializations = specializations;
        therapist.education = education;
        therapist.availability = availability;
        therapist.sessionPrice = sessionPrice;
        therapist.languages = languages;
        therapist.isOnboarded = true;

        await therapist.save();

        res.status(200).json({ success: true, message: "Onboarding completed", therapist });

    } catch (error) {
        console.error("Onboarding error:", error);
        res.status(500).json({ success: false, message: "An error occurred during onboarding." });
    }
};

module.exports = onboardTherapist;