const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {createSession} = require('../controllers/sessionBooking');
const { route } = require('./therapistroute');

router.post('/create',verifyToken, createSession);

module.exports = router;