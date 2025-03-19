import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Event as EventIcon,
  Book as JournalIcon,
  Timeline as MoodTrackerIcon,
  SentimentSatisfiedAlt as MoodIcon,
  Timer as TimerIcon,
  CheckCircle as CompletedIcon,
  LocalFireDepartment as StreakIcon,
  Favorite as HeartIcon,
  Create as WriteIcon
} from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';
import DashboardLayout from '../clientDash/layout';
import TopBar from '../clientDash/topbar';

const Dashboard = () => {
  const { user } = useAuthStore();
  
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon /> },
    { text: 'Sessions', icon: <EventIcon /> },
    { text: 'Journal', icon: <JournalIcon /> },
    { text: 'Mood Tracker', icon: <MoodTrackerIcon /> }
  ];

  const statsData = [
    { title: 'Current Mood', value: 'Positive', icon: <MoodIcon />, color: '#4CAF50' },
    { title: 'Journal Entries', value: '28', icon: <TimerIcon /> },
    { title: 'Sessions Complete', value: '12', icon: <CompletedIcon /> },
    { title: 'Streak', value: '7 days', icon: <StreakIcon />, color: '#FF9800' }
  ];

  const upcomingSessions = [
    {
      name: 'Dr. Emily Wilson',
      time: 'Jan 15, 2025 • 2:00 PM'
    },
    {
      name: 'Dr. Michael Chen',
      time: 'Jan 22, 2025 • 3:30 PM'
    }
  ];

  const journalEntries = [
    {
      title: 'Morning Reflection',
      date: 'Jan 10, 2025',
      content: 'Today I practiced meditation and felt more centered...'
    },
    {
      title: 'Evening Thoughts',
      date: 'Jan 9, 2025',
      content: 'Reflecting on today\'s challenges and victories...'
    }
  ];

  const wellnessTips = [
    'Practice deep breathing exercises for 5 minutes',
    'Write down three things you\'re grateful for'
  ];

  const drawerWidth = 240;

  return (
    <DashboardLayout menuItems={menuItems}>
      <TopBar drawerWidth={drawerWidth} />
      
      {/* Content container - adds top padding to account for fixed AppBar */}
      <Box sx={{ mt: 8, p: 3 }}>
        {/* Welcome Message */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>Welcome back, {user?.fullname || "Guest"}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Track your progress and maintain your mental well-being
          </Typography>
        </Box>
        
        {/* Stats Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 4 }}>
          {statsData.map((stat, index) => (
            <Card key={index} sx={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {React.cloneElement(stat.icon, { sx: { color: stat.color } })}
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {stat.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Two Column Layout */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 3 }}>
          {/* Left Column */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Mood Timeline */}
            <Card sx={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Mood Timeline</Typography>
                <Box sx={{ height: 200, bgcolor: '#f5f5f5', borderRadius: 1, p: 2 }}>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Mood Graph Visualization
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Recent Journal Entries */}
            <Card sx={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Recent Journal Entries</Typography>
                {journalEntries.map((entry, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{entry.title}</Typography>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1 }}>
                      {entry.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {entry.content}
                    </Typography>
                    {index < journalEntries.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Box>

          {/* Right Column */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Upcoming Sessions */}
            <Card sx={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Upcoming Sessions</Typography>
                {upcomingSessions.map((session, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                    <Avatar />
                    <Box>
                      <Typography variant="subtitle2">{session.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {session.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Daily Wellness Tips */}
            <Card sx={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Daily Wellness Tips</Typography>
                {wellnessTips.map((tip, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                    {index === 0 ? <HeartIcon color="error" /> : <WriteIcon color="primary" />}
                    <Typography variant="body2">{tip}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;