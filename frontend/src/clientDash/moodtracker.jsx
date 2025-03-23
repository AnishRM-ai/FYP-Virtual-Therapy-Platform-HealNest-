import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Zoom,
  Fade,
  Paper,
  useTheme,
} from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';
import Layout from './layout';

// Custom styled components
const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const MotionBox = motion(Box);

function MoodTracker({ onAddMood }) {
  const theme = useTheme();
  const [selectedMood, setSelectedMood] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const moodOptions = [
    { 
      value: 'Very Sad', 
      icon: <SentimentVeryDissatisfiedIcon fontSize="large" />, 
      color: '#d32f2f',
      gradient: 'linear-gradient(135deg, #d32f2f 30%, #ff6659 90%)',
      label: 'Very Sad'
    },
    { 
      value: 'Sad', 
      icon: <SentimentDissatisfiedIcon fontSize="large" />, 
      color: '#f57c00',
      gradient: 'linear-gradient(135deg, #f57c00 30%, #ffad42 90%)',
      label: 'Sad'
    },
    { 
      value: 'Neutral', 
      icon: <SentimentNeutralIcon fontSize="large" />, 
      color: '#ffd600',
      gradient: 'linear-gradient(135deg, #ffd600 30%, #ffea00 90%)',
      label: 'Neutral'
    },
    { 
      value: 'Happy', 
      icon: <SentimentSatisfiedAltIcon fontSize="large" />, 
      color: '#4caf50',
      gradient: 'linear-gradient(135deg, #4caf50 30%, #80e27e 90%)',
      label: 'Happy'
    },
    { 
      value: 'Very Happy', 
      icon: <SentimentVerySatisfiedIcon fontSize="large" />, 
      color: '#2196f3',
      gradient: 'linear-gradient(135deg, #2196f3 30%, #6ec6ff 90%)',
      label: 'Very Happy'
    }
  ];

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMood) return;

    onAddMood({
      mood: selectedMood,
      timestamp: new Date(),
      description,
    });

    setSubmitted(true);

    // Reset form after animation
    setTimeout(() => {
      setSelectedMood('');
      setDescription('');
      setSubmitted(false);
    }, 1500);
  };

  const drawerWidth = 240;

  return (
    <Layout
      drawerWidth={drawerWidth}
    >
     <Box sx={{ mt: 8, p: 3 }}>
    <Fade in={true} timeout={800}>
      <Card 
        elevation={6} 
        sx={{ 
          mb: 4, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
          overflow: 'visible'
        }}
      >
        <CardContent sx={{ pb: 4 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              textAlign: 'center', 
              fontWeight: 600,
              color: theme.palette.primary.dark,
              mb: 3
            }}
          >
            How are you feeling today?
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              flexWrap: 'wrap', 
              gap: 2, 
              mb: 4 
            }}>
              {moodOptions.map((option, index) => (
                <Zoom 
                  in={true} 
                  style={{ transitionDelay: `${index * 100}ms` }} 
                  key={option.value}
                >
                  <MotionBox
                    component={Paper}
                    elevation={selectedMood === option.value ? 8 : 2}
                    whileHover={{ 
                      scale: 1.1, 
                      boxShadow: "0px 10px 25px -5px rgba(0,0,0,0.1)" 
                    }}
                    whileTap={{ scale: 0.95 }}
                    sx={{
                      p: 2,
                      borderRadius: 4,
                      width: 100,
                      height: 110,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      background: selectedMood === option.value ? option.gradient : '#fff',
                      border: selectedMood === option.value 
                        ? `2px solid ${option.color}` 
                        : '1px solid rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        background: option.gradient,
                      }
                    }}
                    onClick={() => handleMoodSelect(option.value)}
                  >
                    <Box 
                      sx={{ 
                        color: option.color,
                        fontSize: '2.5rem',
                        mb: 1,
                        animation: selectedMood === option.value 
                          ? `${pulse} 2s infinite ease-in-out` 
                          : 'none'
                      }}
                    >
                      {option.icon}
                    </Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: selectedMood === option.value ? 600 : 400,
                        color: selectedMood === option.value ? '#fff' : 'text.primary'
                      }}
                    >
                      {option.label}
                    </Typography>
                  </MotionBox>
                </Zoom>
              ))}
            </Box>

            <Fade in={!!selectedMood} timeout={500}>
              <Box sx={{ mt: 2, mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="What's on your mind? (optional)"
                  variant="outlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                    '& label.Mui-focused': {
                      color: theme.palette.primary.dark,
                    },
                  }}
                  InputProps={{
                    sx: {
                      backgroundColor: 'rgba(255,255,255,0.8)',
                    }
                  }}
                />
              </Box>
            </Fade>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <MotionBox
                component="div"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={!selectedMood || submitted}
                  sx={{ 
                    mt: 2,
                    px: 4,
                    py: 1.5,
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: '0px 8px 20px rgba(98, 0, 238, 0.2)',
                    background: 'linear-gradient(45deg, #6200ee 30%, #9c47ff 90%)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: '0px 10px 25px rgba(98, 0, 238, 0.3)',
                    },
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {submitted ? 'Saved!' : 'Save Mood'}
                </Button>
              </MotionBox>
            </Box>
          </form>

          {submitted && (
            <Fade in={submitted}>
              <Box sx={{ 
                textAlign: 'center', 
                mt: 3,
                color: 'success.main',
                fontWeight: 500
              }}>
                <Typography variant="body1">
                  Your mood has been recorded! 
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Thank you for sharing how you feel.
                </Typography>
              </Box>
            </Fade>
          )}
        </CardContent>
      </Card>
    </Fade>
    </Box>
    </Layout>
  );
}

export default MoodTracker;