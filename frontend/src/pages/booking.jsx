import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Rating,
  IconButton,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  Badge,
  TextField,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Videocam as VideocamIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as MoneyIcon,
  CalendarMonth as CalendarIcon,
  ExpandMore as ExpandMoreIcon,
  BugReport as BugReportIcon
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const BookingSystem = () => {
  const { id } = useParams();
  const [therapist, setTherapist] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  // Debug state
  const [debugData, setDebugData] = useState({
    therapistRawData: null,
    availabilityRawData: null,
    apiErrors: [],
    lastApiCall: null
  });

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        setDebugData(prev => ({...prev, lastApiCall: `GET http://localhost:5555/api/therapist/${id}`}));
        const response = await axios.get(`http://localhost:5555/api/therapist/${id}`);
        setTherapist(response.data.therapist);
        setDebugData(prev => ({...prev, therapistRawData: response.data}));
      } catch (error) {
        console.error('Error fetching therapist:', error);
        setDebugData(prev => ({
          ...prev, 
          apiErrors: [...prev.apiErrors, {
            endpoint: `GET http://localhost:5555/api/therapist/${id}`,
            error: error.message,
            time: new Date().toISOString()
          }]
        }));
      }
    };

    const fetchAvailability = async () => {
      try {
        setDebugData(prev => ({...prev, lastApiCall: `GET http://localhost:5555/api/therapist/${id}/slots`}));
        const response = await axios.get(`http://localhost:5555/api/therapist/${id}/slots`);
        
        // Store raw data for debugging
        setDebugData(prev => ({...prev, availabilityRawData: response.data}));
        
        // Extract all slots from all availability entries
        let allSlots = [];
        if (response.data.availability && Array.isArray(response.data.availability)) {
          // Loop through each availability entry and extract slots
          response.data.availability.forEach(availabilityItem => {
            if (availabilityItem.slots && Array.isArray(availabilityItem.slots)) {
              allSlots = [...allSlots, ...availabilityItem.slots];
            }
          });
        }
        
        setAvailability(allSlots);
      } catch (error) {
        console.error('Error fetching availability:', error);
        setDebugData(prev => ({
          ...prev, 
          apiErrors: [...prev.apiErrors, {
            endpoint: `GET http://localhost:5555/api/therapist/${id}/slots`,
            error: error.message,
            time: new Date().toISOString()
          }]
        }));
      } finally {
        setLoading(false);
      }
    };

    // Call the fetch functions
    fetchTherapist();
    fetchAvailability();
  }, [id]); // Added missing closing brace and dependency array

  useEffect(() => {
    const selectedDateStr = selectedDate.format('YYYY-MM-DD');
    const slotsForSelectedDate = availability.filter(slot => {
      const slotDateStr = dayjs(slot.startDateTime).format('YYYY-MM-DD');
      return slotDateStr === selectedDateStr && slot.isAvailable;
    });

    setAvailableSlots(slotsForSelectedDate);
  }, [selectedDate, availability]);

  const handleBookSession = async () => {
    if (!selectedTime) {
      return;
    }

    setBooking(true);
    const bookingData = {
      therapistId: id,
      startDateTime: selectedTime,
      endDateTime: dayjs(selectedTime).add(50, 'minute').toISOString()
    };
    
    setDebugData(prev => ({
      ...prev, 
      lastApiCall: `POST http://localhost:5555/api/bookings`,
      lastBookingAttempt: bookingData
    }));
    
    try {
      const response = await axios.post(`http://localhost:5555/api/bookings`, bookingData);
      setBookingSuccess(true);
      setDebugData(prev => ({...prev, lastBookingResponse: response.data}));
    } catch (error) {
      console.error('Error booking session:', error);
      setDebugData(prev => ({
        ...prev, 
        apiErrors: [...prev.apiErrors, {
          endpoint: `POST http://localhost:5555/api/bookings`,
          error: error.message,
          data: bookingData,
          time: new Date().toISOString()
        }]
      }));
    } finally {
      setBooking(false);
    }
  };

  // Debug component
  const DebugPanel = () => (
    <Paper sx={{ p: 2, mt: 4, mb: 2, border: '1px dashed #999' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <BugReportIcon sx={{ mr: 1, color: 'warning.main' }} />
        <Typography variant="h6">Debug Information</Typography>
      </Box>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Therapist Data (API Response)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
            {JSON.stringify(debugData.therapistRawData, null, 2) || "No data fetched yet"}
          </pre>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Availability Data (API Response)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
            {JSON.stringify(debugData.availabilityRawData, null, 2) || "No data fetched yet"}
          </pre>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Processed Slots for Selected Date</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1 }}>Selected Date: {selectedDate.format('YYYY-MM-DD')}</Typography>
          <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
            {JSON.stringify(availableSlots, null, 2) || "No slots available"}
          </pre>
        </AccordionDetails>
      </Accordion>

      {debugData.lastBookingAttempt && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Last Booking Attempt</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
              {JSON.stringify(debugData.lastBookingAttempt, null, 2)}
            </pre>
            {debugData.lastBookingResponse && (
              <>
                <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>Response:</Typography>
                <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
                  {JSON.stringify(debugData.lastBookingResponse, null, 2)}
                </pre>
              </>
            )}
          </AccordionDetails>
        </Accordion>
      )}

      {debugData.apiErrors.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>API Errors ({debugData.apiErrors.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
              {JSON.stringify(debugData.apiErrors, null, 2)}
            </pre>
          </AccordionDetails>
        </Accordion>
      )}

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Component State</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2">Loading: {loading.toString()}</Typography>
            <Typography variant="body2">Booking: {booking.toString()}</Typography>
            <Typography variant="body2">Booking Success: {bookingSuccess.toString()}</Typography>
            <Typography variant="body2">Selected Time: {selectedTime || "None"}</Typography>
            <Typography variant="body2">Available Slots Count: {availableSlots.length}</Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!therapist) {
    return (
      <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
        <Typography>Therapist not found</Typography>
        <DebugPanel />
      </Box>
    );
  }

  if (bookingSuccess) {
    return (
      <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Booking Confirmed!</Typography>
          <Typography variant="body1">
            Your session with {therapist.fullname} has been scheduled for{' '}
            {dayjs(selectedTime).format('MMMM D, YYYY [at] h:mm A')}.
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 3 }}
            onClick={() => window.location.href = '/dashboard'}
          >
            Return to Dashboard
          </Button>
        </Paper>
        <DebugPanel />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 4 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">HealNest</Typography>
          <IconButton>
            <Badge color="error" variant="dot">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
              <Avatar sx={{ width: 80, height: 80 }}>{therapist.fullname.charAt(0)}</Avatar>
              <Box>
                <Typography variant="h5" sx={{ mb: 1 }}>{therapist.fullname}</Typography>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  {therapist.education.map(edu => `${edu.degree}, ${edu.institution} (${edu.year})`).join(', ')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Rating value={therapist.rating} readOnly precision={0.1} />
                  <Typography variant="body2" color="text.secondary">
                    {therapist.rating} ({therapist.reviews} reviews)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VideocamIcon fontSize="small" />
                    <Typography variant="body2">Online Session</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="body2">50 minutes</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MoneyIcon fontSize="small" />
                    <Typography variant="body2">${therapist.sessionPrice} per session</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Typography variant="h6" sx={{ mb: 2 }}>About</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>{therapist.bio || 'No bio available.'}</Typography>

            <Typography variant="h6" sx={{ mb: 2 }}>Select Date</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                // disablePast
                sx={{ width: '100%', mb: 3 }}
              />
            </LocalizationProvider>

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Available Time Slots</Typography>
            {availableSlots.length > 0 ? (
              <Box>
                {availableSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant={selectedTime === slot.startDateTime ? 'contained' : 'outlined'}
                    onClick={() => setSelectedTime(slot.startDateTime)}
                    sx={{ minWidth: 120, mr: 2, mb: 2 }}
                  >
                    {dayjs(slot.startDateTime).format('HH:mm')} - {dayjs(slot.endDateTime).format('HH:mm')}
                  </Button>
                ))}
              </Box>
            ) : (
              <Typography>No slots available for the selected date.</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, position: 'sticky', top: 20 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Booking Summary</Typography>
            
            {selectedTime ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">Date:</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {dayjs(selectedTime).format('MMMM D, YYYY')}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">Time:</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {dayjs(selectedTime).format('h:mm A')} - {dayjs(selectedTime).add(50, 'minute').format('h:mm A')}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="body1">Price:</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    ${therapist.sessionPrice}
                  </Typography>
                </Box>
                
                <Button 
                  variant="contained" 
                  fullWidth 
                  size="large"
                  onClick={handleBookSession}
                  disabled={booking || !selectedTime}
                >
                  {booking ? <CircularProgress size={24} /> : 'Book Session'}
                </Button>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <CalendarIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
                <Typography color="text.secondary">
                  Select a date and time to view booking details
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Debug panel added at the bottom */}
      <DebugPanel />
    </Box>
  );
};

export default BookingSystem;