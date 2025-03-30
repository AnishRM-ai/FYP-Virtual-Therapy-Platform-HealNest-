const Therapist = require('../models/therapistDB');

const getTherapistsForVerification = async (req, res) => {
    try {
        // Fetch all therapists who are not verified
        const therapists = await Therapist.find({ isTherapistVerified: false })
            .select('fullname email avatar specializations education sessionPrice languages qualificationProof');

        res.status(200).json({ success: true, therapists });
    } catch (error) {
        console.error("Error fetching therapists for verification:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { getTherapistsForVerification };
