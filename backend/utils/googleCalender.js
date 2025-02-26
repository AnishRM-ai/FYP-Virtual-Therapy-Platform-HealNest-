const {google} = require('googleapis');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URI
);

oauth2Client.setCredentials({refresh_token: process.env.GOOGLE_REFRESH_TOKEN});

const calender = google.calendar({version:'v3', auth: oauth2Client});

async function createGoogleCalenderEvent({therapistId, clientId, scheduledTime, duration, sessionType }){
    try{
        const event = {
            summary: `Therapy Session - ${sessionType}`,
            description: `Session with therapist ID: ${therapistId} and client ID: ${clientId}`,
            start: {dateTime: new Date(scheduledTime).toISOString(), timeZone: 'UTC'},
            end: {dateTime: new Date(new Date(scheduledTime).getTime() + duration * 60000).toISOString(), timeZone:'UTC'},
            conferenceData: { createRequest: {requestId: `${therapistId}-${clientId}-${Date.now()}`}},

        };

        const response = await calender.events.insert({
            calendarId: 'primary',
            resource: event, 
            conferenceDataVersion: 1,
        });

        return {success: true, meetingLink: response.data.hangoutLink };

    } catch (error) {
        console.error('Google Calender Error:', error);
        return {success: false, error};
    }

}

module.exports = {createGoogleCalenderEvent};