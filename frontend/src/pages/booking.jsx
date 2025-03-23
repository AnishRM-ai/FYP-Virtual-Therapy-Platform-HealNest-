import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Rating,
  Paper,
  Grid,
  CircularProgress,
  CssBaseline,
} from '@mui/material';
import {
  Videocam as VideocamIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as MoneyIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import NavBar from '../components/homenav';
import { useAuthStore } from '../store/authStore';
import useTherapistStore from '../store/therapistStore'; // Import the therapist store
import toast from 'react-hot-toast';
import axios from 'axios';

const BookingSystem = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [meetingLink, setMeetingLink] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [mode, setMode] = useState('light');
  const { user } = useAuthStore();
  
  // Use the therapist store instead of direct axios calls
  const { 
    therapist, 
    availability, 
    loading, 
    fetchTherapistsById, 
    fetchAvailability,
    updateAvailability // Include the updateAvailability function
  } = useTherapistStore();

  useEffect(() => {
    // Use the store's methods to fetch therapist data and availability
    fetchTherapistsById(id);
    fetchAvailability(id);
  }, [id, fetchTherapistsById, fetchAvailability]);

  useEffect(() => {
    if (availability && availability[id]) {
      const selectedDateStr = selectedDate.format('YYYY-MM-DD');
      
      // Extract slots from the availability for the specific therapist
      let allSlots = [];
      if (Array.isArray(availability[id])) {
        availability[id].forEach(availabilityItem => {
          if (availabilityItem.slots && Array.isArray(availabilityItem.slots)) {
            allSlots = [...allSlots, ...availabilityItem.slots];
          } else if (availabilityItem.startDateTime) {
            // Handle the case where availability might be a flat array of slots
            allSlots.push(availabilityItem);
          }
        });
      }
      
      // Filter slots for the selected date
      const slotsForSelectedDate = allSlots.filter(slot => {
        const slotDateStr = dayjs(slot.startDateTime).format('YYYY-MM-DD');
        return slotDateStr === selectedDateStr && slot.isAvailable;
      });

      setAvailableSlots(slotsForSelectedDate);
    }
  }, [selectedDate, availability, id]);

  const handleTimeSelection = (startDateTime, endDateTime) => {
    setSelectedTime(startDateTime);
    setSelectedEndTime(endDateTime);
  };

  const handleBookSession = async () => {
    if (!selectedTime) {
      return;
    }

    setBooking(true);
    const bookingData = {
      therapistId: id,
      clientId: user._id,
      scheduledTime: selectedTime,
      duration: 50,
      payment: {
        amount: therapist.sessionPrice,
        currency: 'Npr',
        status: 'pending',
      },
    };
    
    try {
      // 1. First, book the session
      const response = await axios.post(`http://localhost:5555/session/create`, bookingData);
      
      if (response.data.success) {
        // 2. If booking successful, update the availability to mark it as booked
        const availabilityResponse = await updateAvailability(selectedTime, id);
        
        if (availabilityResponse && availabilityResponse.success === false) {
          toast.error('Session booked but failed to update availability. Please contact support.');
        } else {
          // 3. Update local state to reflect the booked slot
          setAvailableSlots(prevSlots => 
            prevSlots.filter(slot => slot.startDateTime !== selectedTime)
          );
        }
        
        // 4. Set booking success state and store meeting link
        setBookingSuccess(true);
        setMeetingLink(response.data.session.meetingLink);
        
        // 5. Refresh availability after booking
        fetchAvailability(id);
      }
    } catch (error) {
      console.error('Error booking session:', error);
      toast.error('Failed to book the session. Please try again.');
    } finally {
      setBooking(false);
    }
  };

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
          <Typography variant="body1" sx={{ mt: 2 }}>
            Meeting Link: <a href={meetingLink} target="_blank" rel="noopener noreferrer">{meetingLink}</a>
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 3 }}
            onClick={() => window.location.href = '/signin'}
          >
            Return to Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: mode === 'light' ? '#ffffff' : 'background.default', minHeight: '100vh' }}>
      <CssBaseline />
      <NavBar mode={mode} setMode={setMode} />
   
      <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, mb: 4 }}>
              <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
                <Avatar sx={{ width: 80, height: 80 }}>{therapist.fullname?.charAt(0)}</Avatar>
                <Box>
                  <Typography variant="h5" sx={{ mb: 1 }}>{therapist.fullname}</Typography>
                  <Typography color="text.secondary" sx={{ mb: 1 }}>
                    {therapist.education?.map(edu => `${edu.degree}, ${edu.institution} (${edu.year})`).join(', ')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Rating value={therapist.rating || 0} readOnly precision={0.1} />
                    <Typography variant="body2" color="text.secondary">
                      {therapist.rating || 0} ({therapist.reviews || 0} reviews)
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
                  onChange={(newValue) => {
                    setSelectedDate(newValue);
                    setSelectedTime(''); // Reset selected time when date changes
                    setSelectedEndTime('');
                  }}
                  disablePast
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
                      onClick={() => handleTimeSelection(slot.startDateTime, slot.endDateTime)}
                      sx={{ minWidth: 120, mr: 2, mb: 2 }}
                      disabled={!slot.isAvailable}
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
                      {dayjs(selectedTime).format('h:mm A')} - {dayjs(selectedEndTime || selectedTime).add(selectedEndTime ? 0 : 50, 'minute').format('h:mm A')}
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
      </Box>
    </Box>
  );
};

export default BookingSystem;