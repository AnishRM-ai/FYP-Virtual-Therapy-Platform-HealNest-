const express = require('express');
const {getAllTherapist, getTherapistById, availability} = require('../controllers/therapistList');
const router = express.Router();

router.get('/therapist', getAllTherapist);

router.get('/therapist/:id', getTherapistById);

router.get('/therapist/:id/slots', availability);

module.exports = router;