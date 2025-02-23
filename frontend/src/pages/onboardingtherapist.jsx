import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const specializationOptions = ['Depression', 'Anxiety', 'Relationship', 'Trauma'];

const TherapistOnboarding = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    qualificationProof: ['', '', ''], // Allow up to 3 files
    specializations: [],
    education: [{ degree: '', institution: '', year: '' }],
    availability: [{ date: '', slots: [{ startTime: '', endTime: '' }] }],
    sessionPrice: 0,
    languages: [],
    paymentDetails: { provider: '', customerId: '' },
  });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Submit the form data
      console.log('Form Data Submitted:', formData);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (index, e) => {
    const files = [...formData.qualificationProof];
    files[index] = e.target.files[0] ? e.target.files[0].name : '';
    setFormData((prevData) => ({
      ...prevData,
      qualificationProof: files,
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
    availability[dateIndex].slots[slotIndex][name] = value;
    setFormData((prevData) => ({
      ...prevData,
      availability,
    }));
  };

  const steps = ['Qualifications', 'Specializations', 'Availability', 'Payment Details'];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            {formData.qualificationProof.map((file, index) => (
              <Box key={index} marginBottom={2} display="flex" alignItems="center">
                <input
                  accept="application/pdf,image/*"
                  style={{ display: 'none' }}
                  id={`upload-button-file-${index}`}
                  type="file"
                  onChange={(e) => handleFileChange(index, e)}
                />
                <label htmlFor={`upload-button-file-${index}`}>
                  <IconButton color="primary" component="span">
                    <CloudUploadIcon />
                  </IconButton>
                </label>
                <Typography variant="body1" style={{ marginLeft: 8 }}>
                  {file ? `Selected: ${file}` : 'Upload Qualification Proof'}
                </Typography>
              </Box>
            ))}
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
          <Box>
            {formData.availability.map((avail, dateIndex) => (
              <Box key={dateIndex} marginBottom={2}>
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
    <Container>
      <Typography variant="h4" gutterBottom>
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
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" color="primary" onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
};

export default TherapistOnboarding;
