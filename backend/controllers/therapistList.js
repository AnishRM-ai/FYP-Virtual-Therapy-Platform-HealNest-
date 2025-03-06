const Therapist = require('../models/User');
const OpenSlot = require('../models/availability');

const getAllTherapist = async (req, res) => {
    try {
        // Fetch all therapists from the database
        const therapists = await Therapist.find({ role: 'therapist' }).select('-password'); // Exclude password field

        // Check if there are any therapists
        if (!therapists || therapists.length === 0) {
            return res.status(404).json({ success: false, message: 'No therapists found.' });
        }

        res.status(200).json({ success: true, therapists });
    } catch (error) {
        console.error('Error fetching therapists:', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching therapists.' });
    }
}

const getTherapistById = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the therapist by ID from the database
        const therapist = await Therapist.findById(id).select('-password'); // Exclude password field

        // Check if the therapist exists
        if (!therapist) {
            return res.status(404).json({ success: false, message: 'Therapist not found.' });
        }
        
        res.status(200).json({ success: true, therapist });
    } catch (error) {
        console.error('Error fetching therapist:', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching the therapist.' });
    }
};

const availability = async (req, res) => {
    const { id } = req.params;
    try {
        // Check if the therapist exists
        const therapist = await Therapist.findById(id).select('-password');
        if (!therapist) {
            return res.status(404).json({ success: false, message: 'Therapist not found.' });
        }

        // Fetch availability slots for the therapist
        const availability = await OpenSlot.find({ therapistId: id });

        res.status(200).json({ success: true, availability });
    } catch (error) {
        console.error('Error fetching therapist availability:', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching availability.' });
    }
};


module.exports = {
    getAllTherapist,
    getTherapistById,
    availability
};