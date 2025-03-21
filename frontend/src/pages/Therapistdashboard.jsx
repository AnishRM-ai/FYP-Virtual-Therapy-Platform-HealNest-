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
  CircularProgress
} from '@mui/material';
import {
  HomeOutlined,
  CalendarMonthOutlined,
  PeopleOutlined,
  MessageOutlined,
  AccessTimeOutlined,
  CheckCircleOutlined,
  StarOutlined
} from '@mui/icons-material';

import useTherapistStore from '../store/therapistStore';
import dayjs from "dayjs";
import Layout from '../therapistDash/layout';
import AvailabilitySection from '../therapistDash/setAvailability'; // Import the new component

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
    sessions = [] // Provide a default empty array
  } = useTherapistStore();

  // Load therapists and the authenticated therapist
  useEffect(() => {
    fetchTherapists();
    fetchAuthenticatedTherapist();
  }, [fetchTherapists, fetchAuthenticatedTherapist]);

  // Once the authenticated therapist is loaded, fetch their availability and sessions
  useEffect(() => {
    if (therapist?._id) {
      fetchAuthenticatedAvailability();
      fetchSessions(therapist._id);
    }
  }, [therapist, fetchAuthenticatedAvailability, fetchSessions]);

  // Sample statistics data (you can replace these with dynamic values)
  const stats = {
    upcomingSessions: 0,
    completedSessions: 124,
    totalPatients: 45,
    averageRating: 4.8
  };

  const dashboardContent = (
    <>
      {/* Welcome Message */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Welcome, {therapist?.fullname || 'Guest'}!
        </Typography>
      </Box>
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
              {sessions.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                  No sessions created yet.
                </Typography>
              ) : (
                sessions.map(session => (
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

        {/* Replace the old availability section with the new component */}
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
