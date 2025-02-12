import React, { useState } from "react";
import { Box, Stepper, Step, StepLabel, Typography } from "@mui/material";
import BasicInfo from "../onboarding/BasicInfo";
import Qualifications from "../onboarding/Qualifications";
import Availability from "../onboarding/Availability";
import PaymentSetup from "../onboarding/PaymentSetup";
import FinalReview from "../onboarding/FinalReview";
import { useNavigate } from "react-router-dom";

const steps = [
  "Basic Info",
  "Qualifications",
  "Availability",
  "Payment Setup",
  "Final Review",
];

const TherapistOnboarding = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({}); // Store form data
  const navigate = useNavigate();

  const handleNext = (data) => {
    setFormData({ ...formData, ...data });
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFinish = () => {
    console.log("Final Data Submitted:", formData);
    navigate("/dashboard");
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <BasicInfo onNext={handleNext} />;
      case 1:
        return <Qualifications onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <Availability onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <PaymentSetup onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <FinalReview onFinish={handleFinish} onBack={handleBack} />;
      default:
        return "Unknown Step";
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Box width="50%" p={4} boxShadow={3} borderRadius={10} bgcolor="#FFFFFF">
        <Typography variant="h6" align="center" gutterBottom>
          Therapist Onboarding
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box mt={4}>{getStepContent(activeStep)}</Box>
      </Box>
    </Box>
  );
};

export default TherapistOnboarding;
