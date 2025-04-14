import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Paper, Alert, Container, Typography, TextField, Button, Stepper, Step, StepLabel, MenuItem, Select, InputLabel, 
  FormControl, Box, IconButton, Chip, Checkbox, FormControlLabel, Fade, ThemeProvider, createTheme, CssBaseline
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import GoogleIcon from '@mui/icons-material/Google';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SchoolIcon from '@mui/icons-material/School';
import MedicationIcon from '@mui/icons-material/Medication';
import LightModeIcon from '@mui/icons-material/LightMode';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import useOnboardingStore from '../store/onboardingStore.js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Custom theme for mental health aesthetic
const theme = createTheme({
  palette: {
    primary: {
      main: '#68a4a4', // Calm teal
      light: '#9dd3d3',
      dark: '#4e7a7a',
    },
    secondary: {
      main: '#b1aed5', // Soft lavender
      light: '#d9d6ff',
      dark: '#8584a3',
    },
    background: {
      default: '#f7f9fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#414755',
      secondary: '#6e7582',
    },
    error: {
      main: '#e57373',
    },
    warning: {
      main: '#ffb74d',
    },
    info: {
      main: '#64b5f6',
    },
    success: {
      main: '#81c784',
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 22px',
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

const specializationOptions = ['Depression', 'Anxiety', 'Relationship', 'Trauma', 'ADHD', 'Self-Esteem', 'Grief', 'Family Conflict'];
const languageOptions = ['English', 'Spanish', 'French', 'German', 'Nepali', 'Hindi', 'Mandarin', 'Arabic'];

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};

const TherapistOnboarding = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    qualificationDocuments: {
      resume: null,
      professionalLicense: null,
    },
    specializations: [],
    education: [{ degree: '', institution: '', year: '' }],
    slots: [{ startDateTime: '', endDateTime: '', isAvailable: true }],
    sessionPrice: 0,
    languages: [],
    paymentDetails: { provider: '', customerId: '' },
  });

  const onboardTherapist = useOnboardingStore((state) => state.onboardTherapist);
  const navigate = useNavigate();

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      const formDataToSend = new FormData();
      formDataToSend.append('resume', formData.qualificationDocuments.resume);
      formDataToSend.append('professionalLicense', formData.qualificationDocuments.professionalLicense);
      formDataToSend.append('specializations', JSON.stringify(formData.specializations));
      formDataToSend.append('education', JSON.stringify(formData.education));
      formDataToSend.append('slots', JSON.stringify(formData.slots));
      formDataToSend.append('sessionPrice', formData.sessionPrice);
      formDataToSend.append('languages', JSON.stringify(formData.languages));
      formDataToSend.append('paymentDetails', JSON.stringify(formData.paymentDetails));

      try {
        const result = await onboardTherapist(formDataToSend);
        if (result.success) {
          console.log('Form Data Submitted:', formDataToSend);
          toast.success('Onboarding Successful! Welcome to HealNest.');
          navigate('/therapist-dashboard');
        } else {
          console.error('Onboarding failed:', result.message);
          toast.error('Something went wrong. Please try again.');
        }
      } catch (error) {
        console.error('Error during onboarding:', error);
        toast.error('Connection error. Please check your internet and try again.');
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleGoogleCalendarConnect = () => {
    console.log('Connecting to Google Calendar');
    const googleAuthUrl = 'http://localhost:5555/api/calendar/auth/google';
    window.open(googleAuthUrl, '_blank', 'width=600,height=600');
    toast.success('Google Calendar authorization initiated');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      toast.success(`${field} uploaded successfully`);
      setFormData((prevData) => ({
        ...prevData,
        qualificationDocuments: {
          ...prevData.qualificationDocuments,
          [field]: file,
        },
      }));
    }
  };

  const handleSpecializationChange = (specialization) => {
    setFormData((prevData) => {
      const isSelected = prevData.specializations.includes(specialization);
      const updatedSpecializations = isSelected
        ? prevData.specializations.filter((spec) => spec !== specialization)
        : [...prevData.specializations, specialization];
      return {
        ...prevData,
        specializations: updatedSpecializations,
      };
    });
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const education = [...formData.education];
    education[index][name] = value;
    setFormData((prevData) => ({
      ...prevData,
      education,
    }));
  };

  const addEducation = () => {
    setFormData((prevData) => ({
      ...prevData,
      education: [...prevData.education, { degree: '', institution: '', year: '' }],
    }));
  };

  const handleAvailabilityChange = (slotIndex, e) => {
    const { name, value } = e.target;
    const updatedSlots = [...formData.slots];
    updatedSlots[slotIndex][name] = value;
    setFormData((prevData) => ({
      ...prevData,
      slots: updatedSlots,
    }));
  };

  const addNewSlot = () => {
    setFormData((prevData) => ({
      ...prevData,
      slots: [...prevData.slots, { startDateTime: '', endDateTime: '', isAvailable: true }],
    }));
  };

  const removeSlot = (index) => {
    if (formData.slots.length > 1) {
      setFormData((prevData) => {
        const updatedSlots = [...prevData.slots];
        updatedSlots.splice(index, 1);
        return { ...prevData, slots: updatedSlots };
      });
    } else {
      toast.error("You must have at least one availability slot");
    }
  };

  const handleLanguageChange = (language) => {
    setFormData((prevData) => {
      const isSelected = prevData.languages.includes(language);
      const updatedLanguages = isSelected
        ? prevData.languages.filter((lang) => lang !== language)
        : [...prevData.languages, language];
      return {
        ...prevData,
        languages: updatedLanguages,
      };
    });
  };

  const steps = [
    { label: 'Qualifications', icon: <MedicationIcon /> },
    { label: 'Specializations', icon: <SchoolIcon /> },
    { label: 'Availability', icon: <CalendarMonthIcon /> },
    { label: 'Payment Details', icon: <LocalAtmIcon /> }
  ];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 4, 
              my: 4, 
              p: 3, 
              borderRadius: 3,
              backgroundColor: 'background.paper',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
              <Typography variant="h6" color="primary.dark" sx={{ fontWeight: 600, mb: 2 }}>
                Professional Documentation
              </Typography>
              
              <Paper elevation={0} sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                border: '2px dashed',
                borderColor: 'primary.light',
                borderRadius: 2,
                backgroundColor: 'rgba(104, 164, 164, 0.05)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(104, 164, 164, 0.1)',
                }
              }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                  Your resume helps us understand your professional background and experience
                </Typography>
                
                <input
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  id="upload-button-resume"
                  type="file"
                  onChange={(e) => handleFileChange('resume', e)}
                />
                <label htmlFor="upload-button-resume">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{ 
                      borderRadius: 8,
                      px: 3,
                      py: 1.5,
                      borderColor: 'primary.main',
                      color: 'primary.dark',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        backgroundColor: 'rgba(104, 164, 164, 0.1)',
                      }
                    }}
                  >
                    {formData.qualificationDocuments.resume
                      ? `Selected: ${formData.qualificationDocuments.resume.name}`
                      : 'Upload Resume'}
                  </Button>
                </label>
              </Paper>

              <Paper elevation={0} sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                border: '2px dashed',
                borderColor: 'primary.light',
                borderRadius: 2,
                backgroundColor: 'rgba(104, 164, 164, 0.05)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(104, 164, 164, 0.1)',
                }
              }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                  Your professional license verifies your qualifications to practice
                </Typography>
                
                <input
                  accept="application/pdf,image/*"
                  style={{ display: 'none' }}
                  id="upload-button-license"
                  type="file"
                  onChange={(e) => handleFileChange('professionalLicense', e)}
                />
                <label htmlFor="upload-button-license">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{ 
                      borderRadius: 8,
                      px: 3,
                      py: 1.5,
                      borderColor: 'primary.main',
                      color: 'primary.dark',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        backgroundColor: 'rgba(104, 164, 164, 0.1)',
                      }
                    }}
                  >
                    {formData.qualificationDocuments.professionalLicense
                      ? `Selected: ${formData.qualificationDocuments.professionalLicense.name}`
                      : 'Upload Professional License'}
                  </Button>
                </label>
              </Paper>
              
              <Alert severity="info" sx={{ 
                borderRadius: 2, 
                '& .MuiAlert-icon': { color: 'primary.main' } 
              }}>
                Please ensure all documents are clear, legible, and in PDF or image format. 
                Your documents will be reviewed as part of our verification process.
              </Alert>
            </Box>
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 4, 
              my: 4, 
              p: 3, 
              borderRadius: 3,
              backgroundColor: 'background.paper',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
              <Box>
                <Typography variant="h6" color="primary.dark" sx={{ fontWeight: 600, mb: 2 }}>
                  Areas of Focus
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Select the areas you specialize in to help clients find the right match for their needs
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mb={4}>
                  {specializationOptions.map((specialization) => (
                    <Chip
                      key={specialization}
                      label={specialization}
                      color={formData.specializations.includes(specialization) ? 'primary' : 'default'}
                      onClick={() => handleSpecializationChange(specialization)}
                      sx={{
                        borderRadius: '16px',
                        py: 2.5,
                        px: 1,
                        fontWeight: 500,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="h6" color="primary.dark" sx={{ fontWeight: 600, mb: 2 }}>
                  Languages
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Select all languages in which you can provide therapy
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mb={4}>
                  {languageOptions.map((language) => (
                    <Chip
                      key={language}
                      label={language}
                      color={formData.languages.includes(language) ? 'secondary' : 'default'}
                      onClick={() => handleLanguageChange(language)}
                      sx={{
                        borderRadius: '16px',
                        py: 2.5,
                        px: 1,
                        fontWeight: 500,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="h6" color="primary.dark" sx={{ fontWeight: 600, mb: 2 }}>
                  Education & Training
                </Typography>
                
                <AnimatePresence>
                  {formData.education.map((edu, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          mb: 2, 
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'primary.light',
                          backgroundColor: 'rgba(104, 164, 164, 0.05)'
                        }}
                      >
                        <TextField
                          name="degree"
                          label="Degree/Certification"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, e)}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          name="institution"
                          label="Institution"
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(index, e)}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          name="year"
                          label="Year Completed"
                          value={edu.year}
                          onChange={(e) => handleEducationChange(index, e)}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                      </Paper>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <Button 
                  variant="outlined" 
                  onClick={addEducation}
                  sx={{ 
                    mt: 2,
                    borderRadius: 8,
                    borderColor: 'primary.main',
                    color: 'primary.dark',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      backgroundColor: 'rgba(104, 164, 164, 0.1)',
                    }
                  }}
                >
                  + Add Another Degree/Certification
                </Button>
              </Box>
            </Box>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 4, 
              my: 4, 
              p: 3, 
              borderRadius: 3,
              backgroundColor: 'background.paper',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
              <Paper
                elevation={0}
                sx={{
                  width: '100%',
                  p: 4,
                  textAlign: 'center',
                  border: '1px solid',
                  borderColor: 'primary.light',
                  borderRadius: 3,
                  mb: 4,
                  backgroundColor: 'rgba(104, 164, 164, 0.05)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(104, 164, 164, 0.1)',
                  }
                }}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <CalendarMonthIcon sx={{ fontSize: 56, color: 'primary.main', mb: 2 }} />
                </motion.div>
                <Typography variant="h6" gutterBottom fontWeight="bold" color="primary.dark">
                  Connect Your Calendar
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  To manage your therapy sessions efficiently, please connect your Google Calendar.
                  This will help you set your availability and schedule appointments.
                </Typography>
                <Alert severity="info" sx={{ 
                  mb: 3, 
                  borderRadius: 2, 
                  '& .MuiAlert-icon': { color: 'primary.main' } 
                }}>
                  You need to connect your Google account to enable session scheduling and availability management.
                </Alert>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleCalendarConnect}
                  sx={{
                    bgcolor: '#4285F4',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#3367D6',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    },
                    px: 4,
                    py: 1.5,
                    mb: 3,
                    borderRadius: 8,
                    transition: 'all 0.3s ease'
                  }}
                >
                  Connect Google Calendar
                </Button>
              </Paper>

              <Typography variant="h6" color="primary.dark" sx={{ fontWeight: 600, mb: 2 }}>
                Set Your Availability
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Define when you're available to conduct therapy sessions
              </Typography>

              <AnimatePresence>
                {formData.slots.map((slot, slotIndex) => (
                  <motion.div
                    key={slotIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 3, 
                        mb: 3, 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: slot.isAvailable ? 'success.light' : 'text.disabled',
                        backgroundColor: slot.isAvailable ? 'rgba(129, 199, 132, 0.05)' : 'rgba(0, 0, 0, 0.02)'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight={500}>
                          Availability Slot {slotIndex + 1}
                        </Typography>
                        {formData.slots.length > 1 && (
                          <Button 
                            color="error" 
                            size="small" 
                            onClick={() => removeSlot(slotIndex)}
                            sx={{ minWidth: 'auto', p: 1 }}
                          >
                            Remove
                          </Button>
                        )}
                      </Box>
                      
                      <TextField
                        name="startDateTime"
                        label="Start Date & Time"
                        type="datetime-local"
                        value={slot.startDateTime}
                        onChange={(e) => handleAvailabilityChange(slotIndex, e)}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        name="endDateTime"
                        label="End Date & Time"
                        type="datetime-local"
                        value={slot.endDateTime}
                        onChange={(e) => handleAvailabilityChange(slotIndex, e)}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{ mb: 2 }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={slot.isAvailable}
                            onChange={(e) =>
                              handleAvailabilityChange(slotIndex, {
                                target: { name: 'isAvailable', value: e.target.checked },
                              })
                            }
                            sx={{
                              color: 'primary.main',
                              '&.Mui-checked': {
                                color: 'success.main',
                              },
                            }}
                          />
                        }
                        label="Available for Booking"
                      />
                    </Paper>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <Button 
                variant="outlined" 
                onClick={addNewSlot}
                sx={{ 
                  mt: 1,
                  borderRadius: 8,
                  borderColor: 'primary.main',
                  color: 'primary.dark',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: 'rgba(104, 164, 164, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                + Add New Availability Slot
              </Button>
            </Box>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 4, 
              my: 4, 
              p: 3, 
              borderRadius: 3,
              backgroundColor: 'background.paper',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
              <Box>
                <Typography variant="h6" color="primary.dark" sx={{ fontWeight: 600, mb: 2 }}>
                  Session Pricing
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Set your standard session rate. You can offer sliding scale options in your profile later.
                </Typography>
                
                <Paper elevation={0} sx={{ 
                  p: 3, 
                  mb: 4, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'primary.light',
                  backgroundColor: 'rgba(104, 164, 164, 0.05)'
                }}>
                  <TextField
                    name="sessionPrice"
                    label="Session Price ($)"
                    type="number"
                    value={formData.sessionPrice}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <Typography variant="h6" color="primary.main" sx={{ mr: 1 }}>
                          $
                        </Typography>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    This is the standard 50-minute session rate that clients will see on your profile
                  </Typography>
                </Paper>
              </Box>
              
              <Box>
                <Typography variant="h6" color="primary.dark" sx={{ fontWeight: 600, mb: 2 }}>
                  Payment Processing
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Connect your payment processor to receive client payments
                </Typography>
                
                <Paper elevation={0} sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'primary.light',
                  backgroundColor: 'rgba(104, 164, 164, 0.05)'
                }}>
                  <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <InputLabel id="payment-provider-label">Payment Provider</InputLabel>
                    <Select
                      labelId="payment-provider-label"
                      id="payment-provider"
                      name="provider"
                      value={formData.paymentDetails.provider}
                      onChange={(e) => setFormData((prevData) => ({ 
                        ...prevData, 
                        paymentDetails: { 
                          ...prevData.paymentDetails, 
                          provider: e.target.value 
                        } 
                      }))}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">Select a provider</MenuItem>
                      <MenuItem value="Khalti">Khalti</MenuItem>
                      <MenuItem value="Esewa">Esewa</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Fade in={Boolean(formData.paymentDetails.provider)}>
                    <TextField
                      name="customerId"
                      label={formData.paymentDetails.provider === 'Stripe' ? 'Stripe Account ID' : 'PayPal Email'}
                      value={formData.paymentDetails.customerId}
                      onChange={(e) => setFormData((prevData) => ({ 
                        ...prevData, 
                        paymentDetails: { 
                          ...prevData.paymentDetails, 
                          customerId: e.target.value 
                        } 
                      }))}
                      fullWidth
                      margin="normal"
                      helperText={
                        formData.paymentDetails.provider === 'Stripe' 
                          ? "You can find your Stripe Account ID in your Stripe Dashboard" 
                          : "Enter the email associated with your PayPal account"
                      }
                    />
                  </Fade>
                </Paper>
                
                <Alert severity="info" sx={{ 
                  mt: 3, 
                  borderRadius: 2, 
                  '& .MuiAlert-icon': { color: 'primary.main' } 
                }}>
                  HealNest takes a 10% platform fee from each session payment. You'll receive the remaining 90% within 2 business days of each completed session.
                </Alert>
              </Box>
            </Box>
          </motion.div>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container 
        maxWidth="md" 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          py: 4,
          backgroundColor: 'background.default'
        }}
      >
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 3, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f7f9fb 0%, #e8f4f4 100%)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <LightModeIcon sx={{ fontSize: 48, color: 'primary.main', mr: 1 }} />
            </motion.div>
          </Box>
          <Typography variant="h4" gutterBottom align='center' color="primary.dark" sx={{ fontWeight: 600 }}>
            Join Our Healing Community
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '70%', mx: 'auto' }}>
            We're excited to welcome you to HealNest. Complete your profile to start connecting with clients seeking your expertise.
          </Typography>
        </Paper>
        
        <Paper 
          elevation={0} 
          sx={{ 
            p: 0, 
            borderRadius: 3, 
            overflow: 'hidden',
            backgroundColor: 'background.paper'
          }}
        >
          <Box sx={{ 
            p: 3, 
            backgroundColor: 'primary.light', 
            borderTopLeftRadius: 12, 
            borderTopRightRadius: 12 
          }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        color: activeStep === index ? 'primary.dark' : 'primary.light',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: activeStep === index ? 'primary.dark' : 'text.secondary',
                          fontWeight: activeStep === index ? 600 : 400 
                        }}
                      >
                        {step.label}
                      </Typography>
                    </Box>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          
          <Box sx={{ p: 0 }}>
            {activeStep === steps.length ? (
              <motion.div
                initial="initial"
                animate="in"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    p: 6,
                    textAlign: 'center'
                  }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                  >
                    <Box 
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: '50%', 
                        backgroundColor: 'success.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3
                      }}
                    >
                      <Typography variant="h2" color="white">✓</Typography>
                    </Box>
                  </motion.div>
                  
                  <Typography variant="h5" gutterBottom color="primary.dark" sx={{ fontWeight: 600 }}>
                    Thank you for completing the onboarding process!
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '80%' }}>
                    Your profile is now being reviewed by our team. Once approved, you'll be able to start connecting with clients seeking support.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate('/therapist-dashboard')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 8,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 12px rgba(104, 164, 164, 0.25)'
                      }
                    }}
                  >
                    Go to Dashboard
                  </Button>
                </Box>
              </motion.div>
            ) : (
              <div>
                <AnimatePresence mode="wait">
                  {getStepContent(activeStep)}
                </AnimatePresence>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3 }}>
                  <Button 
                    disabled={activeStep === 0} 
                    onClick={handleBack}
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.05)'
                      }
                    }}
                  >
                    Back
                  </Button>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleNext}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 8,
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 10px rgba(104, 164, 164, 0.2)',
                        '&:hover': {
                          boxShadow: '0 6px 12px rgba(104, 164, 164, 0.25)'
                        }
                      }}
                    >
                      {activeStep === steps.length - 1 ? 'Complete Onboarding' : 'Continue'}
                    </Button>
                  </motion.div>
                </Box>
              </div>
            )}
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default TherapistOnboarding;