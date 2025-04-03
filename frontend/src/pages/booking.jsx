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
  Container,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  VideoCall as VideoCallIcon,
  AccessTime as ClockIcon,
  CheckCircle as SuccessIcon,
  FilterList as FilterIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import axios from 'axios';
import NavBar from '../components/homenav';
import { useAuthStore } from '../store/authStore';
import useTherapistStore from '../store/therapistStore';

const MentalHealthBookingSystem = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { id } = useParams();
  const { user } = useAuthStore();

  const {
    therapist,
    availability,
    loading,
    fetchTherapistsById,
    fetchAvailability,
    updateAvailability
  } = useTherapistStore();

  const [selectedTime, setSelectedTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [allSlots, setAllSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [booking, setBooking] = useState(false);
  const [mode, setMode] = useState('light');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  
  // Payment tracking
  const [paymentPidx, setPaymentPidx] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [checkingPaymentStatus, setCheckingPaymentStatus] = useState(false);
  const [paymentStatusInterval, setPaymentStatusInterval] = useState(null);

  // Filter states
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [filterStartTime, setFilterStartTime] = useState('');
  const [filterEndTime, setFilterEndTime] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  // Fetch therapist and availability on component mount
  useEffect(() => {
    fetchTherapistsById(id);
    fetchAvailability(id);
  }, [id, fetchTherapistsById, fetchAvailability]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (paymentStatusInterval) {
        clearInterval(paymentStatusInterval);
      }
    };
  }, [paymentStatusInterval]);

  // Process all available slots
  useEffect(() => {
    if (availability && availability[id]) {
      let processedSlots = [];

      if (Array.isArray(availability[id])) {
        availability[id].forEach(availabilityItem => {
          if (availabilityItem.slots && Array.isArray(availabilityItem.slots)) {
            processedSlots = [...processedSlots, ...availabilityItem.slots];
          } else if (availabilityItem.startDateTime) {
            processedSlots.push(availabilityItem);
          }
        });
      }

      setAllSlots(processedSlots);
    }
  }, [availability, id]);

  // Filter slots based on selected date and additional filters
  useEffect(() => {
    let filteredSlots = allSlots.filter(slot => {
      const slotDate = dayjs(slot.startDateTime);
      const dateMatch = !filterDate || slotDate.isSame(filterDate, 'day');

      // Additional filtering conditions
      const timeMatch = (!filterStartTime ||
        dayjs(slot.startDateTime).format('HH:mm') >= filterStartTime) &&
        (!filterEndTime ||
        dayjs(slot.startDateTime).format('HH:mm') <= filterEndTime);

      const statusMatch = filterStatus === 'all' ||
        (filterStatus === 'available' && slot.isAvailable) ||
        (filterStatus === 'booked' && !slot.isAvailable);

      return dateMatch && timeMatch && statusMatch;
    });

    setAvailableSlots(filteredSlots);
  }, [filterDate, allSlots, filterStartTime, filterEndTime, filterStatus]);

  const handleTimeSelection = (slot) => {
    setSelectedTime(slot.startDateTime);
    setSelectedEndTime(slot.endDateTime);
    // Reset payment states when new time is selected
    setShowPaymentOptions(false);
    setPaymentSuccess(false);
    setPaymentPidx('');
    setPaymentUrl('');
    
    // Clear any existing payment status check interval
    if (paymentStatusInterval) {
      clearInterval(paymentStatusInterval);
      setPaymentStatusInterval(null);
    }
  };

  const initiateBookingProcess = () => {
    if (!user) {
      toast.error('You must be authenticated to book the slot.');
      return;
    }

    if (!selectedTime) {
      toast.error('Please select a time slot first.');
      return;
    }

    setShowPaymentOptions(true);
  };

  const handleKhaltiPayment = async () => {
    if (!therapist || !user || !selectedTime) {
      toast.error('Missing required information.');
      return;
    }
    
    setBooking(true);
    
    try {
      // Create a unique product identifier
      const productIdentity = `SESSION-${id}-${user._id}-${dayjs(selectedTime).format('YYYYMMDD-HHmm')}`;
      const productName = `Therapy Session with ${therapist.fullname}`;
      
      // Customer info
      const customerInfo = {
        name: user.fullname || "Client",
        email: user.email
      };
      
      // Send request to backend to initiate payment
      const response = await axios.post('http://localhost:5555/payment/initiate', {
        therapistId: id,
        clientId: user._id,
        scheduledTime: selectedTime,
        duration: 50, // minutes
        amount: therapist.sessionPrice, // Backend will multiply by 100
        productIdentity,
        productName,
        customerInfo
      });
      console.log(response);
      
      if (response.data.success) {
        // Store payment information
        setPaymentPidx(response.data.payment.pidx);
        setPaymentUrl(response.data.payment.paymentUrl);
        
        // Redirect to Khalti payment page
        window.open(response.data.payment.paymentUrl, '_blank');
        
        // Start checking payment status
        startCheckingPaymentStatus(response.data.payment.pidx);
      } else {
        toast.error('Failed to initiate payment. Please try again.');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Payment initiation failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };
  
  const startCheckingPaymentStatus = (pidx) => {
    // First check immediately
    checkPaymentStatus(pidx);
    
    // Then set up interval to check every 5 seconds
    const intervalId = setInterval(() => {
      checkPaymentStatus(pidx);
    }, 5000);
    
    setPaymentStatusInterval(intervalId);
    
    // Show toast to notify user
    toast.success('Payment initiated! We will check the status automatically.', {
      duration: 5000
    });
  };
  
  const checkPaymentStatus = async (pidx) => {
    if (!pidx) return;
    
    setCheckingPaymentStatus(true);
    
    try {
      const response = await axios.get(`http://localhost:5555/payment/check/${pidx}`);
      
      if (response.data.success) {
        // If payment is completed, proceed with booking
        if (response.data.status === 'Completed' || response.data.status === 'completed') {
          // Clear interval
          if (paymentStatusInterval) {
            clearInterval(paymentStatusInterval);
            setPaymentStatusInterval(null);
          }
          
          setPaymentSuccess(true);
          setPaymentData(response.data.details);
          
          // Complete the booking
          await verifyAndCompleteBooking(pidx);
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    } finally {
      setCheckingPaymentStatus(false);
    }
  };
  
  const verifyAndCompleteBooking = async (pidx) => {
    setBooking(true);
    
    try {
      // Verify payment
      const verificationResponse = await axios.post('http://localhost:5555/payment/verify', {
        pidx,
        therapistId: id,
        clientId: user._id,
        scheduledTime: selectedTime,
        duration: 50
      });
      
      if (verificationResponse.data.success) {
        // Create session
        await completeBookingAfterPayment(pidx);
      } else {
        toast.error('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Payment verification failed. Please contact support.');
    } finally {
      setBooking(false);
    }
  };

  const completeBookingAfterPayment = async (pidx) => {
    const bookingData = {
      therapistId: id,
      clientId: user._id,
      scheduledTime: selectedTime,
      duration: 50,
      payment: {
        amount: therapist.sessionPrice,
        currency: 'NPR',
        status: 'completed',
        method: 'khalti',
        transactionId: pidx
      },
    };

    try {
      const response = await axios.post(`http://localhost:5555/session/create`, bookingData);

      if (response.data.success) {
        const availabilityResponse = await updateAvailability(selectedTime, id);

        if (availabilityResponse && availabilityResponse.success === false) {
          toast.error('Session booked but failed to update availability. Please contact support.');
        } else {
          setAvailableSlots(prevSlots =>
            prevSlots.filter(slot => slot.startDateTime !== selectedTime)
          );
        }

        setBookingSuccess(true);
        setMeetingLink(response.data.session.meetingLink);
        fetchAvailability(id);
      }
    } catch (error) {
      console.error('Error booking session:', error);
      toast.error('Session booking failed after payment. Please contact support.');
    } finally {
      setBooking(false);
    }
  };

  const handleCancelPayment = () => {
    // Clear payment status check interval
    if (paymentStatusInterval) {
      clearInterval(paymentStatusInterval);
      setPaymentStatusInterval(null);
    }
    
    setPaymentPidx('');
    setPaymentUrl('');
    setShowPaymentOptions(false);
  };

  const handleOpenFilterDialog = () => {
    setOpenFilterDialog(true);
  };

  const handleCloseFilterDialog = () => {
    setOpenFilterDialog(false);
  };

  const handleApplyFilters = () => {
    handleCloseFilterDialog();
  };

  const resetFilters = () => {
    setFilterStartTime('');
    setFilterEndTime('');
    setFilterStatus('all');
    setFilterDate('');
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  // Therapist not found
  if (!therapist) {
    return (
      <Box sx={{
        maxWidth: 1200,
        margin: 'auto',
        p: 3
      }}>
        <Typography>Therapist not found</Typography>
      </Box>
    );
  }

  // Booking success screen
  if (bookingSuccess) {
    return (
      <Container maxWidth="sm" sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        backgroundColor: '#f0f4f8'
      }}>
        <Paper elevation={3} sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: 'white',
          textAlign: 'center',
          maxWidth: 500,
          width: '100%'
        }}>
          <SuccessIcon sx={{
            fontSize: 80,
            color: '#4caf50',
            mb: 2
          }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            Appointment Confirmed
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#34495e' }}>
            Your session with {therapist.fullname} is scheduled for{' '}
            {dayjs(selectedTime).format('MMMM D, YYYY [at] h:mm A')}.
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: '#7f8c8d' }}>
            Payment completed via Khalti.
            <br />
            Transaction ID: {paymentPidx.substring(0, 10)}...
          </Typography>
          <Button
            variant="contained"
            href="/client-dashboard"
            target="_blank"
            sx={{
              backgroundColor: '#3498db',
              '&:hover': { backgroundColor: '#2980b9' },
              mb: 2
            }}
          >
            Go back to Dashboard
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{
      backgroundColor: mode === 'light' ? '#f0f4f8' : 'background.default',
      minHeight: '100vh'
    }}>
      <NavBar mode={mode} setMode={setMode} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Therapist Profile Section */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: 'white'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mr: 3,
                    backgroundColor: '#3498db'
                  }}
                >
                  {therapist.fullname?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                    {therapist.fullname}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#34495e', mb: 1 }}>
                    {therapist.education?.map(edu => `${edu.degree}, ${edu.institution} (${edu.year})`).join(', ')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating
                      value={therapist.rating || 0}
                      precision={0.1}
                      readOnly
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {therapist.rating || 0} ({therapist.reviews || 0} reviews)
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50' }}>
                About
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: '#34495e' }}>
                {therapist.bio || 'No bio available.'}
              </Typography>

              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                my: 2
              }}>
                <Typography variant="h6" sx={{ color: '#2c3e50' }}>
                  Available Time Slots
                </Typography>
                <Button
                  startIcon={<FilterIcon />}
                  onClick={handleOpenFilterDialog}
                  variant="outlined"
                >
                  Filter Slots
                </Button>
              </Box>

              {availableSlots.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {availableSlots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={selectedTime === slot.startDateTime ? 'contained' : 'outlined'}
                      onClick={() => handleTimeSelection(slot)}
                      sx={{
                        minWidth: 120,
                        backgroundColor: selectedTime === slot.startDateTime ? '#3498db' : 'transparent',
                        color: selectedTime === slot.startDateTime ? 'white' : '#3498db',
                        '&:hover': {
                          backgroundColor: selectedTime === slot.startDateTime ? '#2980b9' : 'rgba(52, 152, 219, 0.1)'
                        },
                        opacity: slot.isAvailable ? 1 : 0.5
                      }}
                      disabled={!slot.isAvailable}
                    >
                      {dayjs(slot.startDateTime).format('MMMM D, YYYY h:mm A')} - {dayjs(slot.endDateTime).format('h:mm A')}
                      {!slot.isAvailable && ' (Booked)'}
                    </Button>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">
                  No slots available for the selected criteria.
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Booking Summary Section */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: 'white',
                position: 'sticky',
                top: theme.spacing(4)
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, color: '#2c3e50' }}>
                Booking Summary
              </Typography>

              {selectedTime ? (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon sx={{ mr: 1, color: '#3498db' }} />
                      <Typography>Date</Typography>
                    </Box>
                    <Typography fontWeight="medium">
                      {dayjs(selectedTime).format('MMMM D, YYYY')}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ClockIcon sx={{ mr: 1, color: '#3498db' }} />
                      <Typography>Time</Typography>
                    </Box>
                    <Typography fontWeight="medium">
                      {dayjs(selectedTime).format('h:mm A')} - {dayjs(selectedEndTime).format('h:mm A')}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <VideoCallIcon sx={{ mr: 1, color: '#3498db' }} />
                      <Typography>Session Type</Typography>
                    </Box>
                    <Typography fontWeight="medium">
                      Online Video Session
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PaymentIcon sx={{ mr: 1, color: '#3498db' }} />
                      <Typography>Session Price</Typography>
                    </Box>
                    <Typography fontWeight="medium">
                      NPR {therapist.sessionPrice || 0}
                    </Typography>
                  </Box>

                  {!showPaymentOptions ? (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={initiateBookingProcess}
                      sx={{
                        backgroundColor: '#3498db',
                        py: 1.5,
                        '&:hover': { backgroundColor: '#2980b9' }
                      }}
                    >
                      Proceed to Payment
                    </Button>
                  ) : paymentPidx ? (
                    // Payment is in progress
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                        Payment In Progress
                      </Typography>
                      
                      {checkingPaymentStatus ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                          <CircularProgress size={24} />
                        </Box>
                      ) : (
                        <Typography sx={{ mb: 2, textAlign: 'center' }}>
                          Waiting for payment confirmation...
                        </Typography>
                      )}
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={handleCancelPayment}
                          sx={{ mb: 2 }}
                        >
                          Cancel
                        </Button>
                        
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => checkPaymentStatus(paymentPidx)}
                          sx={{
                            backgroundColor: '#3498db',
                            '&:hover': { backgroundColor: '#2980b9' },
                            mb: 2
                          }}
                        >
                          Check Status
                        </Button>
                      </Box>
                      
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => window.open(paymentUrl, '_blank')}
                        sx={{
                          backgroundColor: '#5E338D',
                          color: 'white',
                          py: 1.5,
                          mb: 2,
                          '&:hover': { backgroundColor: '#4a2a70' }
                        }}
                      >
                        Open Khalti Payment Page
                      </Button>
                    </Box>
                  ) : (
                    // Payment options
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                        Choose Payment Method
                      </Typography>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleKhaltiPayment}
                        disabled={booking}
                        sx={{
                          backgroundColor: '#5E338D', // Khalti's purple color
                          color: 'white',
                          py: 1.5,
                          mb: 2,
                          '&:hover': { backgroundColor: '#4a2a70' }
                        }}
                      >
                        {booking ? <CircularProgress size={24} /> : 'Pay with Khalti'}
                      </Button>
                      <Typography variant="body2" sx={{ textAlign: 'center', color: '#7f8c8d' }}>
                        By proceeding with the payment, you agree to our terms and policies.
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  py: 4
                }}>
                  <CalendarIcon sx={{
                    fontSize: 60,
                    color: '#bdc3c7',
                    mb: 2
                  }} />
                  <Typography color="text.secondary">
                    Select a date and time to book your session
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Filter Dialog */}
      <Dialog open={openFilterDialog} onClose={handleCloseFilterDialog}>
        <DialogTitle>Filter Time Slots</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Date"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Start Time"
              type="time"
              value={filterStartTime}
              onChange={(e) => setFilterStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
              fullWidth
            />
            <TextField
              label="End Time"
              type="time"
              value={filterEndTime}
              onChange={(e) => setFilterEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
              fullWidth
            />
            <TextField
              select
              label="Slot Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              fullWidth
              SelectProps={{ native: true }}
            >
              <option value="all">All Slots</option>
              <option value="available">Available Slots</option>
              <option value="booked">Booked Slots</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetFilters} color="secondary">
            Reset Filters
          </Button>
          <Button onClick={handleApplyFilters} color="primary">
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MentalHealthBookingSystem;