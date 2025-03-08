const Session = require('../models/session');
const {google} = require('googleapis');
const GoogleToken = require('../models/googleCalendar');
const User = require('../models/User');

// Get OAuth2 client and stored credential
const getOAuth2Client = async (userId) => {
    const tokenData = await GoogleToken.findOne({ userId});
    if(!tokenData) throw new Error('Google authentication required');

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CALENDAR_CLIENT_ID,
        process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
        process.env.GOOGLE_CALENDAR_CALLBACK_URL
    );

    oauth2Client.setCredentials({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
    });

    //Check if the access token is expired
    const now = new Date().getTime();
    if(new Date(tokenData.expiry_date).getTime() < now) {
        console.log('Access token is expired, Refreshing...');
        try{
            const {credentials} = await oauth2Client.refreshAccessToken();
            //update the token in db
            tokenData.access_token = credentials.access_token;
            tokenData.expiry_date = credentials.expiry_date;
            await tokenData.save();
        } catch (err) {
            console.err('Error Refreshing access token: ', err);
            throw new Error('Google authentication failed, please reconnect.');
        }
    }
    return oauth2Client;
};

// create a new session and sync with google calendar.
const createSession = async (req, res) => {
    try{
        const {therapistId, clientId, scheduledTime, duration, meetingLink, payment} = req.body;

         // Get the OAuth2 client
         const oauth2Client = await getOAuth2Client(req.userId);

         // Initialize the Google Calendar API client
         const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        //google calendar event.
        const event = {
            summary: "Therapy Session",
            description: "A virtual therapy session.",
            start: {dateTime: scheduledTime, timeZone: 'UTC'},
            end: { dateTime: new Date(new Date(scheduledTime).getTime() + duration * 60000).toISOString(), timeZone: 'UTC' },
            attendees:[],
            reminders: {useDefault: true}
        }

    
    const calendarEvent = await calendar.events.insert({
        calendarId: 'primary',
        resource: event
    });

    const newSession = new Session({
        therapistId,
        clientId,
        scheduledTime,
        duration,
        status:'scheduled',
        meetingLink,
        payment,
        calendarEventId: calendarEvent.data.id
    });

    await newSession.save();
    res.status(201).json({success: true, session: newSession});
   } catch(err){
    console.error("Error creating session: ", err);
    res.status(500).json({success: false, message: 'Error creating session', err});
    }
};

module.exports  = {createSession};

