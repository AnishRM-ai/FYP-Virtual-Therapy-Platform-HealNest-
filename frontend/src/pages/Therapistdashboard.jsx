import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  Stack,
  Box,
  Card,
  CardContent,
  Rating
} from '@mui/material';
import {
  HomeOutlined,
  CalendarMonthOutlined,
  PeopleOutlined,
  MessageOutlined,
  AccessTimeOutlined,
  CheckCircleOutlined,
  StarOutlined,
  FeedbackOutlined
} from '@mui/icons-material';

import useTherapistStore from '../store/therapistStore';
import dayjs from "dayjs";
import Layout from '../therapistDash/layout';
import AvailabilitySection from '../therapistDash/setAvailability';
import useFeedbackStore from '../store/feedbackStore';

const drawerWidth = 240;

export default function HealNestDashboard() {
  const [selectedTab, setSelectedTab] = useState('Dashboard');
  const {
    loading,
    error,
    fetchTherapists,
    fetchAuthenticatedAvailability,
    fetchAuthenticatedTherapist,
    therapist,
    fetchSessions,
    sessions = [], 
  } = useTherapistStore();

  const {
    fetchCurrentTherapistFeedback, 
    feedbacks = [], 
    loading: feedbackLoading, 
    error: feedbackError 
  } = useFeedbackStore();

  // Load therapists and the authenticated therapist
  useEffect(() => {
    fetchTherapists();
    fetchAuthenticatedTherapist();
  }, [fetchTherapists, fetchAuthenticatedTherapist]);

  // Once the authenticated therapist is loaded, fetch their availability, sessions, and feedbacks
  useEffect(() => {
    if (therapist?._id) {
      fetchAuthenticatedAvailability();
      fetchSessions(therapist._id);
      fetchCurrentTherapistFeedback(); // Fetch feedbacks for the therapist
    }
  }, [therapist, fetchAuthenticatedAvailability, fetchSessions, fetchCurrentTherapistFeedback]);

  // Filter sessions to show only scheduled sessions
  const scheduledSessions = sessions.filter(session => session.status === 'scheduled');
  const completedsession = sessions.filter(session => session.status === 'completed' );

  const uniqueClientIds = [...new Set(sessions.map(session => session.clientId._id))];
const totalPatients = uniqueClientIds.length;
  // Sort feedbacks by most recent
  const recentFeedbacks = [...feedbacks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3); // Display only the 3 most recent feedbacks

 
  const stats = {
    upcomingSessions: scheduledSessions.length,
    completedSessions: completedsession.length,
    totalPatients: totalPatients,
    averageRating: feedbacks.length > 0 
      ? (feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length).toFixed(1)
      : 0
  };

  // Rest of the component remains the same as in the original code...
  
  const dashboardContent = (
    <>
      {/* Welcome Message */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Welcome, {therapist?.fullname || 'Guest'}!
        </Typography>
      </Box>
      
      {/* Statistics Grid */}
      <Grid container spacing={3} sx={{ mb: 1 }}>
        <Grid item xs={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarMonthOutlined sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Upcoming Sessions
              </Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">
              {stats.upcomingSessions}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CheckCircleOutlined sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Completed Sessions
              </Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">
              {stats.completedSessions}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PeopleOutlined sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Total Patients
              </Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">
              {stats.totalPatients}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <StarOutlined sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Average Rating
              </Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">
              {stats.averageRating}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    

      <Grid container spacing={3}>
        {/* Upcoming Sessions Column */}
        <Grid item xs={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="medium">
                Upcoming Sessions
              </Typography>
              <Button
                variant="contained"
                disableElevation
                sx={{
                  bgcolor: 'black',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                  }
                }}
              >
                New Session
              </Button>
            </Box>

            <Stack spacing={3}>
              {scheduledSessions.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                  No scheduled sessions.
                </Typography>
              ) : (
                scheduledSessions.map(session => (
                  <Box key={session._id} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: '#f0f0f0', color: 'text.primary', mr: 2 }}>
                      {session.clientId.fullname.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {session.clientId.fullname} {session.status}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Therapy Session
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {dayjs(session.scheduledTime).format('YYYY-MM-DD h:mm A')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {session.duration} minutes
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Recent Feedbacks Column */}
        <Grid item xs={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="medium">
                Recent Feedbacks
              </Typography>
              <FeedbackOutlined sx={{ color: 'text.secondary' }} />
            </Box>

            <Stack spacing={3}>
              {recentFeedbacks.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                  No recent feedbacks.
                </Typography>
              ) : (
                recentFeedbacks.map(feedback => (
                  <Box 
                    key={feedback._id} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      borderBottom: '1px solid', 
                      borderColor: 'divider', 
                      pb: 2 
                    }}
                  >
                    <Avatar sx={{ width: 40, height: 40, bgcolor: '#f0f0f0', color: 'text.primary', mr: 2 }}>
                      {feedback.clientId.fullname.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {feedback.clientId.fullname}
                        </Typography>
                        <Rating 
                          value={feedback.rating} 
                          precision={0.5} 
                          size="small" 
                          readOnly 
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {feedback.comment}
                      </Typography>
                      <Typography variant="caption" color="text.disabled" sx={{ mt: 1 }}>
                        {dayjs(feedback.createdAt).format('YYYY-MM-DD h:mm A')}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Availability Section */}
        <AvailabilitySection />
      </Grid>
    </>
  );

  return (
    <Layout
      drawerWidth={drawerWidth}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
      user={therapist}
    >
      {dashboardContent}
    </Layout>
  );
}