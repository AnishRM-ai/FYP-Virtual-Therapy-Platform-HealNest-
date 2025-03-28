const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {createSession, getTherapistSession, cancelSession, updateTherapistNotes, getClientSessions, setSessionStatusToCompleted, deleteSession} = require('../controllers/sessionBooking');


router.post('/create',verifyToken, createSession);
router.get('/getSession', verifyToken, getTherapistSession);
router.get('/clientSession',verifyToken, getClientSessions);
router.put('/notes/:sessionId', verifyToken, updateTherapistNotes);
router.delete('/delete/:sessionId', verifyToken, deleteSession);
router.put('/status/:sessionId', verifyToken, setSessionStatusToCompleted);
router.post('/cancel/:sessionId', verifyToken, cancelSession);

module.exports = router;