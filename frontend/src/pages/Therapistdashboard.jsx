import React, { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Grid,
  Avatar,
  Button,
  Stack,
  IconButton,
  CardContent,
  Card,
  CircularProgress
} from '@mui/material';
import {
  HomeOutlined,
  CalendarMonthOutlined,
  PeopleOutlined,
  MessageOutlined,
  AccessTimeOutlined,
  CheckCircleOutlined,
  StarOutlined,
  NotificationsOutlined,
  CircleOutlined
} from '@mui/icons-material';

import { useAuthStore } from '../store/authStore';
import useTherapistStore from '../store/therapistStore';
import dayjs from "dayjs";

const drawerWidth = 240;

export default function HealNestDashboard() {
  const [selectedTab, setSelectedTab] = useState('Dashboard');
  const { therapists, availability, loading, error, fetchTherapists, fetchAvailability, fetchAuthenticatedTherapist, therapist } = useTherapistStore();

  useEffect(() => {
    fetchTherapists();
    fetchAuthenticatedTherapist();
  }, [fetchTherapists, fetchAuthenticatedTherapist]);

  useEffect(() => {
    if (therapists.length > 0) {
      therapists.forEach(therapist => {
        if (therapist._id) {
          fetchAvailability(therapist._id);
        }
      });
    }
  }, [therapists, fetchAvailability]);

  // Sample data
  const stats = {
    upcomingSessions: 8,
    completedSessions: 124,
    totalPatients: 45,
    averageRating: 4.8
  };

  const todaysSessions = [
    {
      id: 1,
      name: 'Michael Brown',
      therapy: 'Anxiety Management',
      time: '2:00 PM',
      duration: '45 mins'
    },
    {
      id: 2,
      name: 'Emma Wilson',
      therapy: 'Depression Therapy',
      time: '3:30 PM',
      duration: '60 mins'
    }
  ];

  const sidebarItems = [
    { text: 'Dashboard', icon: <HomeOutlined /> },
    { text: 'Sessions', icon: <CalendarMonthOutlined /> },
    { text: 'Patients', icon: <PeopleOutlined /> },
    { text: 'Messages', icon: <MessageOutlined /> },
    { text: 'Availability', icon: <AccessTimeOutlined /> },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
          <CircleOutlined sx={{ mr: 1, color: 'black' }} />
          <Typography variant="h6" noWrap fontWeight="bold">
            HealNest
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {sidebarItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={selectedTab === item.text}
              onClick={() => setSelectedTab(item.text)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          boxShadow: 'none',
          backgroundColor: 'white',
          color: 'black'
        }}
      >
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <IconButton size="large" color="inherit">
            <NotificationsOutlined />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#f0f0f0', color: 'text.primary', mr: 1 }}>
              {therapist?.fullname?.charAt(0) || 'T'}
            </Avatar>
            <Box>
              <Typography variant="body1" fontWeight="medium">
                {therapist?.fullname || 'Loading...'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {therapist?.email || 'No email available'}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: '#f5f5f7', p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >

        
        <Toolbar />

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
                  Today's Sessions
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
                {todaysSessions.map(session => (
                  <Box key={session.id} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: '#f0f0f0', color: 'text.primary', mr: 2 }}>
                      {session.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {session.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {session.therapy}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {session.time}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {session.duration}
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
              {!loading && !error && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {Object.values(availability).flat().map((slot, index) => (
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
                        <Typography variant='body2' fontWeight="bold">
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
              )}
              {Object.values(availability).flat().length === 0 && !loading && !error && (
                <Typography>No slots available for the selected date.</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
