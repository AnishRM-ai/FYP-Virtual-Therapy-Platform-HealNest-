import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
  Rating,
  Avatar,
  CssBaseline,
  Chip,
  Divider,
  Paper,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import SchoolIcon from '@mui/icons-material/School';
import { motion } from 'framer-motion';
import NavBar from '../components/homenav';
import useTherapistStore from '../store/therapistStore';
import { useNavigate } from 'react-router-dom';

// Color theme for mental health aesthetic
const theme = {
  light: {
    primary: '#5C6BC0', // Soft indigo
    secondary: '#78909C', // Blue grey
    background: '#F5F7FA', // Soft light background
    card: '#FFFFFF',
    accent: '#80DEEA', // Soft teal
    text: {
      primary: '#37474F',
      secondary: '#78909C'
    }
  },
  dark: {
    primary: '#5C6BC0', // Keep same primary for consistency
    secondary: '#90A4AE',
    background: '#263238', // Deep blue-grey
    card: '#37474F',
    accent: '#4DB6AC', // Muted teal
    text: {
      primary: '#ECEFF1',
      secondary: '#B0BEC5'
    }
  }
};

// Animated wrapper component with refined animation
const AnimatedElement = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut", delay }}
    viewport={{ once: true, margin: "0px 0px -100px" }}
  >
    {children}
  </motion.div>
);

// Hero Section Component
const HeroSection = ({ mode }) => (
  <Box 
    sx={{ 
      py: 6, 
      mb: 6, 
      borderRadius: 2,
      bgcolor: mode === 'light' ? 'rgba(92, 107, 192, 0.08)' : 'rgba(92, 107, 192, 0.15)',
      textAlign: 'center'
    }}
  >
    <AnimatedElement>
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom
        sx={{ 
          fontWeight: 700,
          color: mode === 'light' ? theme.light.text.primary : theme.dark.text.primary
        }}
      >
        Find Your Path to Wellness
      </Typography>
      <Typography 
        variant="h6" 
        component="h2"  
        sx={{ 
          maxWidth: 700, 
          mx: 'auto', 
          mb: 4,
          color: mode === 'light' ? theme.light.text.secondary : theme.dark.text.secondary
        }}
      >
        Connect with licensed therapists who specialize in your needs
      </Typography>
    </AnimatedElement>

    <AnimatedElement delay={0.2}>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          maxWidth: 600,
          mx: 'auto',
          p: 0.5,
          borderRadius: 3,
          bgcolor: mode === 'light' ? '#fff' : theme.dark.card,
          boxShadow: mode === 'light' 
            ? '0 8px 20px rgba(92, 107, 192, 0.15)' 
            : '0 8px 20px rgba(0, 0, 0, 0.3)'
        }}
      > 
        <TextField
          fullWidth
          placeholder="Search by specialty, issue, or therapist name"
          variant="standard"
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start" sx={{ ml: 1 }}>
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{ px: 1 }}
        />
        <Button 
          variant="contained" 
          color="primary"
          sx={{ 
            borderRadius: 2,
            px: 3,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Search
        </Button>
      </Paper>
    </AnimatedElement>
  </Box>
);

// Filter Chips Component
const FilterChips = ({ mode }) => {
  const filters = [
    'Anxiety', 'Depression', 'Trauma', 'Relationships', 
    'Online Sessions', 'In-Person', 'Evening Hours'
  ];
  
  return (
    <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {filters.map((filter, index) => (
        <AnimatedElement key={filter} delay={0.1 + index * 0.05}>
          <Chip 
            label={filter} 
            variant="outlined" 
            color="primary"
            clickable
            sx={{ 
              borderRadius: 1.5,
              bgcolor: mode === 'light' ? 'rgba(92, 107, 192, 0.08)' : 'rgba(92, 107, 192, 0.15)',
              '&:hover': {
                bgcolor: mode === 'light' ? 'rgba(92, 107, 192, 0.15)' : 'rgba(92, 107, 192, 0.25)',
              }
            }}
          />
        </AnimatedElement>
      ))}
    </Box>
  );
};

// Therapist Card Component with refined design
const TherapistCard = ({
  name,
  rating = 0,
  reviews = 0,
  degree = '',
  license = '',
  language = [],
  specialties = [],
  sessionPrice = 0,
  mode = 'light',
  index,
  therapistId
}) => {
  const navigate = useNavigate();
  const currentTheme = mode === 'light' ? theme.light : theme.dark;

  const handleBookSession = () => {
    navigate(`/booking/${therapistId}`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1
      }}
      viewport={{ once: true }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: currentTheme.card,
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: mode === 'light'
            ? '0 4px 20px rgba(0,0,0,0.08)'
            : '0 4px 20px rgba(0,0,0,0.3)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: mode === 'light'
              ? '0 12px 28px rgba(92, 107, 192, 0.2)'
              : '0 12px 28px rgba(0,0,0,0.4)'
          }
        }}
      >
        <Box sx={{ 
          height: 8, 
          width: '100%', 
          bgcolor: currentTheme.primary 
        }} />
        
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: 'flex', mb: 2.5 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mr: 2.5,
                bgcolor: currentTheme.primary,
                boxShadow: mode === 'light'
                  ? '0 4px 12px rgba(92, 107, 192, 0.2)'
                  : '0 4px 12px rgba(0,0,0,0.25)'
              }}
            >
              {name.charAt(0)}
            </Avatar>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 0.5,
                  color: currentTheme.text.primary
                }}
              >
                {name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Rating
                  value={rating}
                  precision={0.5}
                  readOnly
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Typography 
                  variant="body2"
                  sx={{ color: currentTheme.text.secondary }}
                >
                  ({reviews} reviews)
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <SchoolIcon fontSize="small" sx={{ color: currentTheme.secondary, fontSize: 16 }} />
                <Typography 
                  variant="body2" 
                  sx={{ color: currentTheme.text.secondary }}
                >
                  {degree} • {license}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 1, 
                fontWeight: 600,
                color: currentTheme.text.primary
              }}
            >
              Specializations
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
              {specialties.slice(0, 4).map(specialty => (
                <Chip 
                  key={specialty}
                  label={specialty} 
                  size="small"
                  sx={{ 
                    fontSize: '0.75rem',
                    bgcolor: mode === 'light' ? 'rgba(92, 107, 192, 0.1)' : 'rgba(92, 107, 192, 0.2)',
                    color: currentTheme.primary,
                    fontWeight: 500
                  }}
                />
              ))}
            </Box>
          </Box>
          
          {language.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LanguageIcon 
                fontSize="small" 
                sx={{ color: currentTheme.secondary, mr: 1, fontSize: 16 }}
              />
              <Typography 
                variant="body2"
                sx={{ color: currentTheme.text.secondary }}
              >
                {language.join(', ')}
              </Typography>
            </Box>
          )}

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: currentTheme.primary
              }}
            >
              ${sessionPrice}/hour
            </Typography>
          </Box>
        </CardContent>
        
        <CardActions sx={{ p: 3, pt: 0 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleBookSession}
            sx={{ 
              textTransform: 'none',
              py: 1,
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: mode === 'light'
                  ? '0 4px 12px rgba(92, 107, 192, 0.3)'
                  : '0 4px 12px rgba(0,0,0,0.3)'
              }
            }}
          >
            Book a Session
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
};

const TherapistFinder = () => {
  const [mode, setMode] = useState('light');
  const currentTheme = mode === 'light' ? theme.light : theme.dark;

  const {
    therapists,
    loading,
    error,
    fetchTherapists
  } = useTherapistStore();

  useEffect(() => {
    fetchTherapists();
  }, [fetchTherapists]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading therapists...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">Error loading therapists. Please try again.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      bgcolor: mode === 'light' ? theme.light.background : theme.dark.background, 
      minHeight: '100vh' 
    }}>
      <CssBaseline />
      <NavBar mode={mode} setMode={setMode} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <HeroSection mode={mode} />
        
        <AnimatedElement delay={0.3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 600,
                color: currentTheme.text.primary
              }}
            >
              Available Therapists
            </Typography>
            
            <IconButton
              color="primary"
              sx={{
                bgcolor: mode === 'light' ? 'rgba(92, 107, 192, 0.08)' : 'rgba(92, 107, 192, 0.15)',
                '&:hover': {
                  bgcolor: mode === 'light' ? 'rgba(92, 107, 192, 0.15)' : 'rgba(92, 107, 192, 0.25)',
                }
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Box>
        </AnimatedElement>
        
        <FilterChips mode={mode} />

        <Grid container spacing={3}>
          {therapists.map((therapist, index) => (
            <Grid item xs={12} sm={6} md={4} key={therapist._id || therapist.name}>
              <TherapistCard
                therapistId={therapist._id}
                name={therapist.fullname}
                rating={therapist.rating}
                reviews={therapist.reviews}
                degree={therapist.degree}
                language={therapist.language || []}
                license={therapist.license}
                specialties={therapist.specializations || []}
                sessionPrice={therapist.sessionPrice}
                mode={mode}
                index={index}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TherapistFinder;