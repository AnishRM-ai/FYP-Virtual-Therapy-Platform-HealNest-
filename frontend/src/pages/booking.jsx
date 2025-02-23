import React, { useState } from 'react';
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
  Divider
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Notifications as NotificationsIcon,
  Videocam as VideocamIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

const BookingSystem = () => {
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 2, 3)); // March 3, 2025
  const [selectedTime, setSelectedTime] = useState('9:00 AM');

  // Generate week dates
  const getWeekDates = (current) => {
    const week = [];
    const firstDay = new Date(current);
    firstDay.setDate(firstDay.getDate() - firstDay.getDay()); // Get Sunday

    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDay);
      date.setDate(date.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const weekDates = getWeekDates(selectedDate);
  
  const timeSlots = [
    ['9:00 AM', '10:00 AM', '11:30 AM'],
    ['2:00 PM', '3:30 PM', '5:00 PM']
  ];

  const getDayName = (date) => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  };

  const isSelectedDate = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 4 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'black', width: 32, height: 32 }}>H</Avatar>
            <Typography variant="h6">HealNest</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton>
              <Badge color="error" variant="dot">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar>JD</Avatar>
              <Typography>John Doe</Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, mb: 4 }}>
            {/* Therapist Info */}
            <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
              <Avatar sx={{ width: 80, height: 80 }}>SJ</Avatar>
              <Box>
                <Typography variant="h5" sx={{ mb: 1 }}>Dr. Sarah Johnson</Typography>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  Clinical Psychologist, MA, Ph.D
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Rating value={4.9} readOnly precision={0.1} />
                  <Typography variant="body2" color="text.secondary">
                    4.9 (120+ reviews)
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
                    <Typography variant="body2">120 per session</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Calendar */}
            <Typography variant="h6" sx={{ mb: 2 }}>Select Date & Time</Typography>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <IconButton>
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton>
                  <ChevronRightIcon />
                </IconButton>
              </Box>
              <Grid container spacing={1} sx={{ mb: 4 }}>
                {weekDates.map((date) => (
                  <Grid item xs key={date.toISOString()}>
                    <Button
                      fullWidth
                      onClick={() => setSelectedDate(date)}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        p: 2,
                        backgroundColor: isSelectedDate(date) ? 'primary.main' : 'transparent',
                        color: isSelectedDate(date) ? 'white' : 'inherit',
                        '&:hover': {
                          backgroundColor: isSelectedDate(date) ? 'primary.dark' : 'action.hover'
                        }
                      }}
                    >
                      <Typography variant="caption">{getDayName(date)}</Typography>
                      <Typography variant="body1">{date.getDate()}</Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Time Slots */}
            <Typography variant="h6" sx={{ mb: 2 }}>Available Time Slots</Typography>
            <Box>
              {timeSlots.map((row, rowIndex) => (
                <Box key={rowIndex} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  {row.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'contained' : 'outlined'}
                      onClick={() => setSelectedTime(time)}
                      sx={{ minWidth: 120 }}
                    >
                      {time}
                    </Button>
                  ))}
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Booking Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Booking Summary</Typography>
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography color="text.secondary">Date</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography color="text.secondary">Time</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>{selectedTime}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography color="text.secondary">Duration</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>50 minutes</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography color="text.secondary">Session Fee</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>$120</Typography>
                </Grid>
              </Grid>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              onClick={() => alert('Booking confirmed!')}
            >
              Confirm Booking
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © 2025 MindfulCare. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default BookingSystem;