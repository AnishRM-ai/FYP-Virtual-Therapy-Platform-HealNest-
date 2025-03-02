const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const oauth2Client = require('../config/googleCalendarAuth');

router.get('/auth/google', (req, res)=>{
    const authUrl = oauth2Client.generateAuthUrl({
        access_type:'offline',
        scope:['https://www.googleapis.com/auth/calendar'],
        prompt:'consent',
    });
    res.redirect(authUrl);
});

router.get('/auth/google/calendar/callback', async (req, res) => {
    const {code} = req.query;

    try{

        const {tokens} = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        res.send('Google Calendar connected successfully!');
    } catch (error) { 
        console.error('Error retrieving access token', error);
        res.status(500).send('Error connecting to Google Calendar');
    }
});

module.exports = router;