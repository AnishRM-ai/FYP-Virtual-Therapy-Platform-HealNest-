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

const drawerWidth = 240;

export default function HealNestDashboard() {
  const [selectedTab, setSelectedTab] = useState('Dashboard');
  const {
    availability,
    loading,
    error,
    fetchTherapists,
    fetchAuthenticatedAvailability,
    fetchAuthenticatedTherapist,
    therapist,
    fetchSessions,
    sessions
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
    upcomingSessions: sessions.length,
    completedSessions: 124,
    totalPatients: 45,
    averageRating: 4.8
  };

  // Extract the authenticated therapist’s availability slots
  const therapistAvailability = therapist && availability[therapist._id] ? availability[therapist._id] : null;
  const slots = therapistAvailability && therapistAvailability.slots ? therapistAvailability.slots : [];

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
              {sessions.map(session => (
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
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Available Time Slots
            </Typography>

            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}

            {!loading && !error && slots && slots.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {slots.map((slot, index) => (
                  <Card
                    key={index}
                    sx={{
                      minWidth: 120,
                      maxWidth: 150,
                      p: 1,
                      boxShadow: 1,
                      border: "1px solid",
                      borderColor: "grey.300",
                      transition: "0.3s",
                      "&:hover": { boxShadow: 3 },
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", p: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {dayjs(slot.startDateTime).format("MMM D, YYYY")}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {dayjs(slot.startDateTime).format("HH:mm")} -{" "}
                        {dayjs(slot.endDateTime).format("HH:mm")}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              !loading && !error && <Typography>No available slots found.</Typography>
            )}
          </Paper>
        </Grid>
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
