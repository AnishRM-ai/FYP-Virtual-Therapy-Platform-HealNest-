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
  CssBaseline
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { motion } from 'framer-motion';
import NavBar from '../components/homenav';
import useTherapistStore from '../store/therapistStore';
import { useNavigate } from 'react-router-dom';

// Animated wrapper component
const AnimatedElement = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    {children}
  </motion.div>
);

// Therapist Card Component
const TherapistCard = ({
  name,
  rating = 0,
  reviews = 0,
  degree = '',
  license = '',
  language =[],
  specialties = [],
  sessionPrice = 0,
  mode = 'light',
  index,
  therapistId
}) => {
  const navigate = useNavigate();

  const handleBookSession = () => {
    navigate(`/booking/${therapistId}`);
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.2
      }}
      viewport={{ once: true }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: mode === 'light' ? 'background.paper' : 'grey.800',
          boxShadow: mode === 'light'
            ? '0 4px 6px rgba(0,0,0,0.1)'
            : '0 4px 6px rgba(255,255,255,0.1)'
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mr: 2,
                bgcolor: 'primary.main'
              }}
            >
              {name.charAt(0)}
            </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mr: 1 }}>
                  {name}
                </Typography>
                <Rating
                  value={rating}
                  precision={0.1}
                  readOnly
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  ({reviews} reviews)
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {degree}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {license}
              </Typography>
              <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                {specialties.join(' • ')}
              </Typography>
            </Box>
          </Box>

          <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
            ${sessionPrice}/hour
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleBookSession}
            sx={{ textTransform: 'none' }}
          >
            Book Session
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
};

const TherapistFinder = () => {
  const [mode, setMode] = useState('light');

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
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error loading therapists</Typography>;
  }

  return (
    <Box sx={{ backgroundColor: mode === 'light' ? '#ffffff' : 'background.default', minHeight: '100vh' }}>
      <CssBaseline />
      <NavBar mode={mode} setMode={setMode} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name or specialty"
            sx={{
              mr: 2,
              '& .MuiOutlinedInput-root': {
                height: '40px'
              }
            }}
            InputProps={{
              style: { height: '40px' }
            }}
          />
          <IconButton
            color="primary"
            variant="outlined"
            sx={{
              border: '1px solid rgba(0,0,0,0.23)',
              borderRadius: '4px',
              padding: '8px'
            }}
          >
            <FilterListIcon />
          </IconButton>
        </Box>

        <AnimatedElement>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ mb: 4, textAlign: 'center' }}
          >
            Find Your Therapist
          </Typography>
        </AnimatedElement>

        <Grid container spacing={4}>
          {therapists.map((therapist, index) => (
            <Grid item xs={12} sm={6} md={4} key={therapist._id || therapist.name}>
              <TherapistCard
              therapistId={therapist._id}
                name={therapist.fullname}
                rating={therapist.rating}
                reviews={therapist.reviews}
                degree={therapist.degree}
                language={therapist.language}
                license={therapist.license}
                specialties={therapist.specializations}
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
