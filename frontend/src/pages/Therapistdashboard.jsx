import React, { useState } from 'react';
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
  Card,
  CardContent,
  CardHeader,
  Rating,
  Stack,
  IconButton
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

// Drawer width
const drawerWidth = 240;

export default function HealNestDashboard() {
  const [selectedTab, setSelectedTab] = useState('Dashboard');

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

  const recentFeedback = [
    {
      id: 1,
      name: 'Alex Thompson',
      rating: 5,
      comment: 'Great session! Really helped me understand my anxiety triggers better.'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      rating: 4,
      comment: 'Thank you for the helpful coping strategies.'
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
      
      {/* Top AppBar */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#f0f0f0', color: 'text.primary', mr: 1 }}>SW</Avatar>
            <Typography variant="body1" fontWeight="medium">
              Dr. Sarah Wilson
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Sidebar */}
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
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: '#f5f5f7', p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
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
        
        {/* Today's Sessions & Recent Feedback */}
        <Grid container spacing={3}>
          {/* Today's Sessions */}
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
          
          {/* Recent Feedback */}
          <Grid item xs={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="medium" sx={{ mb: 3 }}>
                Recent Feedback
              </Typography>
              
              <Stack spacing={3}>
                {recentFeedback.map(feedback => (
                  <Box key={feedback.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#f0f0f0', color: 'text.primary', mr: 1 }}>
                        {feedback.name.charAt(0)}
                      </Avatar>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {feedback.name}
                      </Typography>
                    </Box>
                    <Rating 
                      value={feedback.rating} 
                      readOnly 
                      size="small" 
                      sx={{ mb: 0.5 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      "{feedback.comment}"
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}