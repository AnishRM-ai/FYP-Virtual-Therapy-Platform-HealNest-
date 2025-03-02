import React, { useState } from 'react';
import {
  Paper, Alert, Container, Typography, TextField, Button, Stepper, Step, StepLabel, MenuItem, Select, InputLabel, FormControl, Box, IconButton, Chip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import GoogleIcon from '@mui/icons-material/Google';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import useOnboardingStore from '../store/onboardingStore.js';
import toast from 'react-hot-toast';

const specializationOptions = ['Depression', 'Anxiety', 'Relationship', 'Trauma'];
const languageOptions = ['English', 'Spanish', 'French', 'German', 'Nepali']; // Add more languages as needed

const TherapistOnboarding = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    qualificationDocuments: {
      resume: null,
      professionalLicense: null, // Allow up to 2 degree certificates
    },
    specializations: [],
    education: [{ degree: '', institution: '', year: '' }],
    availability: [{ date: '', slots: [{ startTime: '', endTime: '' }] }],
    sessionPrice: 0,
    languages: [ ],
    paymentDetails: { provider: '', customerId: '' },
  });

  const onboardTherapist = useOnboardingStore((state) => state.onboardTherapist);

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      const formDataToSend = new FormData();
      formDataToSend.append('resume', formData.qualificationDocuments.resume);
      formDataToSend.append('professionalLicense', formData.qualificationDocuments.professionalLicense);
      formDataToSend.append('specializations', JSON.stringify(formData.specializations));
      formDataToSend.append('education', JSON.stringify(formData.education));
      formDataToSend.append('availability', JSON.stringify(transformAvailability()));
      formDataToSend.append('sessionPrice', formData.sessionPrice);
      formDataToSend.append('languages', JSON.stringify(formData.languages));
      formDataToSend.append('paymentDetails', JSON.stringify(formData.paymentDetails));

      const result = await onboardTherapist(formDataToSend);
      if (result.success) {
        console.log('Form Data Submitted:', formDataToSend);
        toast.success('Onboarding Successful! Welcome to HealNest.')
      } else {
        console.error('Onboarding failed:', result.message);
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };



 
  const handleGoogleCalendarConnect = () => {
    console.log('Connecting to Google Calendar');

    const googleAuthUrl = 'http://localhost:5555/api/calendar/auth/google';

  // Open the URL in a new tab
  window.open(googleAuthUrl, '_blank', 'width=600,height=600');
  };

  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  const transformAvailability = () => {
    const workingHours = formData.availability
      .map((avail) => {
        const date = new Date(avail.date);
        const day = daysOfWeek[date.getDay()];

        return avail.slots.map((slot) => ({
          day,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isAvailable: true
        }));
      })
      .flat();

    return {
      workingHours,
      sessionDuration: 60,
      breakBetweenSessions: 15,
      timezone: 'UTC'
    };
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
    setFormData((prevData) => ({
      ...prevData,
      qualificationDocuments: {
        ...prevData.qualificationDocuments,
        [field]: file,
      },
    }));
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

  const handleAvailabilityChange = (dateIndex, slotIndex, e) => {
    const { name, value } = e.target;
    const availability = [...formData.availability]; 
    
    if(name === "date"){
      availability[dateIndex][name] = value;
    } else {
      availability[dateIndex].slots[slotIndex][name] = value;
    }
    setFormData((prevData) => ({
      ...prevData,
      availability,
    }));
  };

  const addNewAvailability = () => {
    setFormData((prevData) => ({
      ...prevData,
      availability: [...prevData.availability, { date: '', slots: [{ startTime: '', endTime: '' }] }],
    }));
  };

  const addNewSlot = (dateIndex) => {
    const availability = [...formData.availability];
    availability[dateIndex].slots.push({ startTime: '', endTime: '' });

    setFormData((prevData) => ({
      ...prevData,
      availability,
    }));
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

  const steps = ['Qualifications', 'Specializations', 'Availability', 'Payment Details'];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            {/* Resume Upload */}
            <Box marginBottom={2} display="flex" alignItems="center">
              <input
                accept="application/pdf"
                style={{ display: 'none' }}
                id="upload-button-resume"
                type="file"
                onChange={(e) => handleFileChange('resume', e)}
              />
              <label htmlFor="upload-button-resume">
                <IconButton color="primary" component="span">
                  <CloudUploadIcon />
                </IconButton>
              </label>
              <Typography variant="body1" style={{ marginLeft: 8 }}>
                {formData.qualificationDocuments.resume
                  ? `Selected: ${formData.qualificationDocuments.resume.name}`
                  : 'Upload Resume'}
              </Typography>
            </Box>

            {/* Professional License Upload */}
            <Box marginBottom={2} display="flex" alignItems="center">
              <input
                accept="application/pdf,image/*"
                style={{ display: 'none' }}
                id="upload-button-license"
                type="file"
                onChange={(e) => handleFileChange('professionalLicense', e)}
              />
              <label htmlFor="upload-button-license">
                <IconButton color="primary" component="span">
                  <CloudUploadIcon />
                </IconButton>
              </label>
              <Typography variant="body1" style={{ marginLeft: 8 }}>
                {formData.qualificationDocuments.professionalLicense
                  ? `Selected: ${formData.qualificationDocuments.professionalLicense.name}`
                  : 'Upload Professional License'}
              </Typography>
            </Box>

            
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select your specializations:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {specializationOptions.map((specialization) => (
                <Chip
                  key={specialization}
                  label={specialization}
                  color={formData.specializations.includes(specialization) ? 'primary' : 'default'}
                  onClick={() => handleSpecializationChange(specialization)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
            <Typography variant="h6" gutterBottom marginTop={2}>
              Select your languages:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {languageOptions.map((language) => (
                <Chip
                  key={language}
                  label={language}
                  color={formData.languages.includes(language) ? 'primary' : 'default'}
                  onClick={() => handleLanguageChange(language)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
            {formData.education.map((edu, index) => (
              <Box key={index} marginBottom={2}>
                <TextField
                  name="degree"
                  label="Degree"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, e)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  name="institution"
                  label="Institution"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, e)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  name="year"
                  label="Year"
                  value={edu.year}
                  onChange={(e) => handleEducationChange(index, e)}
                  fullWidth
                  margin="normal"
                />
              </Box>
            ))}
          </Box>
        );
      case 2:
        return (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            my: 4
          }}>
            <Paper
              elevation={0}
              sx={{
                width: '100%',
                maxWidth: 'md',
                p: 4,
                textAlign: 'center',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                mb: 4
              }}
            >
              <CalendarMonthIcon
                sx={{
                  fontSize: 48,
                  color: 'primary.main',
                  mb: 2
                }}
              />

              <Typography variant="h6" gutterBottom fontWeight="bold">
                Connect Your Calendar
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                To manage your therapy sessions efficiently, please connect your Google Calendar.
                This will help you set your availability and schedule appointments.
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
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
                    bgcolor: '#3367D6'
                  },
                  px: 4,
                  py: 1.5,
                  mb: 3
                }}
              >
                Connect Google Calendar
              </Button>
            </Paper>

            {/* Existing availability form */}
            {formData.availability.map((avail, dateIndex) => (
              <Box key={dateIndex} marginBottom={2} sx={{ width: '100%' }}>
                <TextField
                  name="date"
                  label="Date"
                  type="date"
                  value={avail.date}
                  onChange={(e) => handleAvailabilityChange(dateIndex, 0, e)}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                {avail.slots.map((slot, slotIndex) => (
                  <Box key={slotIndex} marginBottom={2}>
                    <TextField
                      name="startTime"
                      label="Start Time"
                      type="datetime-local"
                      value={slot.startTime}
                      onChange={(e) => handleAvailabilityChange(dateIndex, slotIndex, e)}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <TextField
                      name="endTime"
                      label="End Time"
                      type="datetime-local"
                      value={slot.endTime}
                      onChange={(e) => handleAvailabilityChange(dateIndex, slotIndex, e)}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  onClick={() => addNewSlot(dateIndex)}
                  sx={{ mt: 1 }}
                >
                  Add New Slot
                </Button>
              </Box>
            ))}
          </Box>
        );
      case 3:
        return (
          <Box>
            <TextField
              name="sessionPrice"
              label="Session Price"
              type="number"
              value={formData.sessionPrice}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Payment Provider</InputLabel>
              <Select
                name="provider"
                value={formData.paymentDetails.provider}
                onChange={(e) => setFormData((prevData) => ({ ...prevData, paymentDetails: { ...prevData.paymentDetails, provider: e.target.value } }))}
              >
                <MenuItem value="Stripe">Stripe</MenuItem>
                <MenuItem value="Paypal">Paypal</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="customerId"
              label="Customer ID"
              value={formData.paymentDetails.customerId}
              onChange={(e) => setFormData((prevData) => ({ ...prevData, paymentDetails: { ...prevData.paymentDetails, customerId: e.target.value } }))}
              fullWidth
              margin="normal"
            />
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      py: 4
    }}>
      <Typography variant="h4" gutterBottom align='center'>
        Therapist Onboarding
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography variant="h5" gutterBottom>
              Thank you for completing the onboarding process!
            </Typography>
            <Typography variant="subtitle1">
              Your details have been saved.
            </Typography>
          </div>
        ) : (
          <div>
            {getStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </div>
        )}
      </div>
    </Container>
  );
};

export default TherapistOnboarding;
