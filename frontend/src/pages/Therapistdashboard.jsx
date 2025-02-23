import React from 'react';
import {
  AppBar,
  Box,
  Card,
  CardContent,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Rating,
  Toolbar,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Feedback as FeedbackIcon,
  Notifications as NotificationsIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  Message as MessageIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const Dashboard = () => {
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon /> },
    { text: 'Patients', icon: <PeopleIcon /> },
    { text: 'Sessions', icon: <EventIcon /> },
    { text: 'Feedback', icon: <FeedbackIcon /> }
  ];

  const statsData = [
    { title: 'Total Patients', value: '248', subtext: '+12 this month', icon: <PeopleIcon /> },
    { title: 'Booked Sessions', value: '42', subtext: 'Next 7 days', icon: <CalendarIcon /> },
    { title: 'Completed Sessions', value: '156', subtext: 'This month', icon: <MessageIcon /> },
    { title: 'Average Rating', value: '4.8', subtext: 'From 180 reviews', icon: <StarIcon /> }
  ];

  const upcomingSessions = [
    {
      name: 'John Doe',
      type: 'Anxiety Management',
      time: 'Today, 2:00 PM',
      duration: '45 minutes'
    },
    {
      name: 'Jane Smith',
      type: 'Depression Therapy',
      time: 'Today, 3:30 PM',
      duration: '60 minutes'
    }
  ];

  const recentFeedback = [
    {
      rating: 5,
      comment: 'Dr. Sarah is incredibly understanding and professional. The sessions have helped me tremendously.',
      name: 'Alex Johnson',
      time: '2 days ago'
    },
    {
      rating: 4,
      comment: 'Great progress in my anxiety management. Looking forward to more sessions.',
      name: 'Maria Garcia',
      time: '1 week ago'
    }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, bgcolor: 'black', borderRadius: '50%' }} />
            HealNest
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.text}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar 
          position="static" 
          color="transparent" 
          elevation={0}
          sx={{ mb: 4 }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4">Welcome back, Dr. Sarah</Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Here's your practice overview
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton>
                <NotificationsIcon />
              </IconButton>
              <Avatar />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Stats Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 4 }}>
          {statsData.map((stat, index) => (
            <Card key={index}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4">{stat.value}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="caption" color={index === 0 ? 'success.main' : 'text.secondary'}>
                      {stat.subtext}
                    </Typography>
                  </Box>
                  <Box sx={{ color: 'text.secondary' }}>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Upcoming Sessions */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Upcoming Sessions</Typography>
            {upcomingSessions.map((session, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 2,
                  '&:hover': { bgcolor: 'action.hover' },
                  borderRadius: 1,
                  mb: 1
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar />
                  <Box>
                    <Typography variant="subtitle1">{session.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {session.type}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="subtitle1">{session.time}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {session.duration}
                  </Typography>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Recent Feedback</Typography>
            {recentFeedback.map((feedback, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Rating value={feedback.rating} readOnly sx={{ mb: 1 }} />
                <Typography variant="body1" sx={{ mb: 1 }}>
                  "{feedback.comment}"
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar />
                    <Typography variant="subtitle2">{feedback.name}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {feedback.time}
                  </Typography>
                </Box>
                {index < recentFeedback.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;