const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {createSession, getTherapistSession} = require('../controllers/sessionBooking');
const { route } = require('./therapistroute');

router.post('/create',verifyToken, createSession);
router.get('/getSession', verifyToken, getTherapistSession);

module.exports = router;