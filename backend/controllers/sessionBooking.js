const Session = require('../models/session');
const {google} = require('googleapis');
const GoogleToken = require('../models/googleCalendar');
const User = require('../models/User');
const paymentController = require('../controllers/paymentController');



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
        expiry_date: tokenData.expiry_date,
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
            console.error('Error Refreshing access token: ', err);
            throw new Error('Google authentication failed, please reconnect.');
        }
    }
    return oauth2Client;
};

// create a new session and sync with google calendar.
const createSession = async (req, res) => {
    try {
        const {therapistId, clientId, scheduledTime, duration } = req.body;

        const therapist = await User.findById(therapistId).select('fullname email');
        const client = await User.findById(clientId).select('fullname email');

        if (!therapist || !client) {
            return res.status(404).json({ success: false, message: "Therapist or client not found." });
        }

        // Get the OAuth2 client
        const oauth2Client = await getOAuth2Client(therapistId);

        // Initialize the Google Calendar API client
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        // Google calendar event
        const event = {
            summary: "Therapy Session",
            description: "A virtual therapy session.",
            start: { dateTime: scheduledTime, timeZone: 'UTC' },
            end: { dateTime: new Date(new Date(scheduledTime).getTime() + duration * 60000).toISOString(), timeZone: 'UTC' },
            attendees: [
                { email: therapist.email, displayName: therapist.fullname },
                { email: client.email, displayName: client.fullname }
            ],
            conferenceData: {
                createRequest: { requestId: `${Date.now()}`, conferenceSolutionKey: { type: 'hangoutsMeet' } }
            },
            reminders: { useDefault:true  }
        };

        const calendarEvent = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1,
            sendUpdates: 'all'
        });

        const meetingLink = calendarEvent.data.hangoutLink;

        const newSession = new Session({
            therapistId,
            clientId,
            scheduledTime,
            duration,
            status: 'scheduled',
            meetingLink,
            calendarEventId: calendarEvent.data.id
        });

        await newSession.save();
        res.status(201).json({ success: true, session: newSession });
    } catch (err) {
        console.error("Error creating session: ", err);
        const { pidx } = req.body;
        
        // If payment was already verified but session creation failed, attempt refund
        if (pidx) {
            try {
                // Check if payment was completed
                const paymentRecord = await Payment.findOne({ transactionId: pidx });
                
                if (paymentRecord && paymentRecord.status === 'paid') {
                    // Attempt to refund the payment
                    await refundPayment(
                        pidx,
                        paymentRecord.amount * 100, // Convert to paisa
                        'Session creation failed'
                    );
                    
                    // Update payment record
                    paymentRecord.status = 'refunded';
                    await paymentRecord.save();
                }
            } catch (refundError) {
                console.error('Refund failed:', refundError);
            }
        }

        res.status(500).json({
            success: false,
            message: 'Error creating session',
            error: err.message
        });
    }
};
//Get therapist session
const getTherapistSession= async(req, res) => {
     
    try{
        const therapistId = req.userId;
        const sessions = await Session.find({ therapistId})
        .populate("clientId", "fullname email")
        .populate("therapistId", "fullname")
        .sort({scheduledTime: 1});

        if(!sessions.length) {
            return res.status(200).json({ success: true, message: "No sessions found."});
        }

        res.status(200).json({success: true, message:"Therapist session fetched success", sessions});


    }catch (err){
        console.log("Error fetching therapist sessions:", err);
        res.status(500).json({success: false, message:"Internal server error"});    }
};

//Session Cancellation function.
const cancelSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { cancelledBy, reason } = req.body;

        if (!cancelledBy || !['client', 'therapist'].includes(cancelledBy)) {
            return res.status(400).json({ success: false, message: "Invalid cancellation initiator." });
        }

        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found" });
        }

        if (session.status === "cancelled") {
            return res.status(400).json({ success: false, message: "Session is already cancelled." });
        }

        // Get therapist's OAuth token
        const tokens = await GoogleToken.findOne({ userId: session.therapistId });
        if (!tokens) {
            return res.status(401).json({ success: false, message: "Therapist is not connected to Google." });
        }

        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token
        });

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        // Delete event from the therapist's calendar
        if (session.calendarEventId) {
            await calendar.events.delete({
                calendarId: "primary",
                eventId: session.calendarEventId
            });
        }

        // Update session status to "cancelled"
        session.status = "cancelled";
        session.cancellation = {
            reason,
            cancelledBy,
            cancelledAt: new Date()
        };

        await session.save();

        res.status(200).json({ success: true, message: "Session cancelled successfully.", session });
    } catch (error) {
        console.error("Error cancelling session:", error);
        res.status(500).json({ success: false, message: "Error cancelling session", error });
    }
};


//delete Sesssion.
const deleteSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const therapistId = req.userId;

        // Find the session by ID
        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found" });
        }

        // Check if the therapist is authorized to delete the session
        if (session.therapistId.toString() !== therapistId) {
            return res.status(403).json({ success: false, message: "Unauthorized access" });
        }

        // Get the OAuth2 client with token refresh handling
        const oauth2Client = await getOAuth2Client(therapistId);

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        // Check if the event exists before attempting to delete
        if (session.calendarEventId) {
            try {
                await calendar.events.delete({
                    calendarId: "primary",
                    eventId: session.calendarEventId
                });
            } catch (calendarError) {
                if (calendarError.code === 410) {
                    console.warn("Calendar event already deleted:", calendarError.message);
                } else {
                    throw calendarError;
                }
            }
        }

        // Delete the session from the database
        await Session.findByIdAndDelete(sessionId);

        res.status(200).json({ success: true, message: "Session deleted successfully" });
    } catch (error) {
        console.error("Error deleting session:", error);
        res.status(500).json({ success: false, message: "Error deleting session", error: error.message });
    }
};
const setSessionStatusToCompleted = async (req, res) => {
    const { sessionId } = req.params; // Retrieve sessionId from the URL params
    const therapistId = req.userId; // Assuming the therapist ID is stored in the request (e.g., from JWT token)
    
    try {
        const session = await Session.findOneAndUpdate(
            { _id: sessionId, therapistId }, // Ensure only the assigned therapist can update the session
            { $set: { status: 'completed' } }, // Update session status to 'completed'
            { new: true, runValidators: true } // Return updated document and validate input
        );

        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found or unauthorized access.' });
        }

        res.status(200).json({ success: true, message: 'Session status updated to completed', session });
    } catch (error) {
        console.error('Error updating session status:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


// Get client sessions
const getClientSessions = async (req, res) => {
    try{
        const clientId = req.userId;
        const sessions = await Session.find({clientId})
        .populate("clientId", "fullname")
        .populate("therapistId", "fullname email")
        .sort({scheduledTime: 1});

        if(!sessions.length) {
            return res.status(200).json({ success: true, message: "No sessions found."});
        }

        res.status(200).json({success: true, message:"Therapist session fetched success", sessions});


    }catch (err){
        console.log("Error fetching therapist sessions:", err);
        res.status(500).json({success: false, message:"Internal server error"});    }
};


const getSessionDetails = async (req, res) => {
    try {
        const session = await Session.findById(req.params.sessionId)
            .populate('therapistId clientId');
        
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching session details' });
    }
};

//update private notes .
const updatePrivateNotes = async (req, res) => {
    const {sessionId} = req.params;
    const {privateNotes} = req.body;
    const therapistId = req.userId;
    try {
        // Find and update session with validation that the therapist owns this session
        const session = await Session.findOneAndUpdate(
            { _id: sessionId, therapistId },
            { $set: { 'notes.therapistNotes': privateNotes }},
            { new: true, runValidators: true }
        );

        if (!session) {
            return res.status(404).json({ 
                success: false, 
                message: 'Session not found or unauthorized access' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Private notes updated successfully',
            session
        });
    } catch (error) {
        console.error('Error updating private notes:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: error.message
        });
    }
};

//Shared notes accessible by both client and therapist.
const updateSharedNotes = async (req, res) => {
    const { sessionId } = req.params;
    const { sharedNotes } = req.body;
    const therapistId = req.userId;
    
    try {
        const session = await Session.findOneAndUpdate(
            { _id: sessionId, therapistId },
            { $set: { 'notes.sharedNotes': sharedNotes }},
            { new: true, runValidators: true }
        );

        if (!session) {
            return res.status(404).json({ 
                success: false, 
                message: 'Session not found or unauthorized access' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Shared notes updated successfully',
            session
        });
    } catch (error) {
        console.error('Error updating shared notes:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: error.message
        });
    }
};

//get client session history with the current therapist.
const getClientSessionsHistory = async (req, res) => {
    const { clientId } = req.params;
    const therapistId = req.userId;
    
    try {
        // Validate that clientId is a valid ObjectId
        if (!clientId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid client ID format' 
            });
        }

        // Find all sessions between this therapist and client
        const sessions = await Session.find({ 
            therapistId,
            clientId
        })
        .populate('clientId', 'fullname email')
        .sort({ scheduledTime: -1 }); // Sort by most recent first

        res.status(200).json({ 
            success: true, 
            message: 'Client session history retrieved successfully',
            sessions
        });
    } catch (error) {
        console.error('Error fetching client sessions history:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: error.message
        });
    }
};

//get both notes for a session
const getSessionNotes = async (req, res) => {
    const { sessionId } = req.params;
    const therapistId = req.userId;
    
    try {
        const session = await Session.findOne({ 
            _id: sessionId, 
            therapistId 
        })
        .select('notes scheduledTime status clientId');

        if (!session) {
            return res.status(404).json({ 
                success: false, 
                message: 'Session not found or unauthorized access' 
            });
        }

        res.status(200).json({ 
            success: true, 
            notes: session.notes,
            sessionDetails: {
                scheduledTime: session.scheduledTime,
                status: session.status,
                clientId: session.clientId
            }
        });
    } catch (error) {
        console.error('Error fetching session notes:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: error.message
        });
    }
};

const updateSessionNotes = async (req, res) => {
    const { sessionId } = req.params;
    const { privateNotes, sharedNotes } = req.body;
    const therapistId = req.userId;
    
    try {
        // Create an update object with only the fields that are provided
        const updateFields = {};
        if (privateNotes !== undefined) {
            updateFields['notes.therapistNotes'] = privateNotes;
        }
        if (sharedNotes !== undefined) {
            updateFields['notes.sharedNotes'] = sharedNotes;
        }
        
        // If no fields to update, return early
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No notes provided for update' 
            });
        }

        const session = await Session.findOneAndUpdate(
            { _id: sessionId, therapistId },
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!session) {
            return res.status(404).json({ 
                success: false, 
                message: 'Session not found or unauthorized access' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Session notes updated successfully',
            session
        });
    } catch (error) {
        console.error('Error updating session notes:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports  = {createSession,
                     getTherapistSession,
                    cancelSession,
            setSessionStatusToCompleted,
        getClientSessions,
         deleteSession,
         getSessionDetails,
        updatePrivateNotes,
        updateSharedNotes,
        getClientSessionsHistory,
        getSessionNotes,
        updateSessionNotes};

