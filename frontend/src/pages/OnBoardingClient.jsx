import React, { useState } from "react";
import { Box, Stepper, Step, StepLabel, Typography, Button } from "@mui/material";
import EmergencyContactForm from "../onBoardingClient/emergencyContact";
import PreferencesForm from "../onBoardingClient/preferences";
import MedicalHistoryForm from "../onBoardingClient/medicalConditions";
import useOnboardingStore from "../store/onboardingStore";

const steps = ["Emergency Contact", "Preferences", "Medical History"];

const ClientOnboarding = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        emergencyContact: { name: "", relationship: "", phoneNumber: "" },
        preferences: { therapistGender: "", preferredLanguage: "", preferredSessionTime: "" },
        medicalHistory: { conditions: [], medications: [], allergies: [], lastUpdated: "" }
    });

    const {onboardClient} = useOnboardingStore();
    const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
    const handleBack = () => setActiveStep((prevStep) => prevStep - 1);
     
    const handleDataChange = (key, value) => {
        setFormData((prevData) => ({ ...prevData, [key]: value }));
    };

    const handleSubmit = () => {
        console.log("Final Data:", formData);
        // API call to save client onboarding data
        onboardClient(formData);
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <EmergencyContactForm data={formData.emergencyContact} onChange={(value) => handleDataChange("emergencyContact", value)} />;
            case 1:
                return <PreferencesForm data={formData.preferences} onChange={(value) => handleDataChange("preferences", value)} />;
            case 2:
                return <MedicalHistoryForm data={formData.medicalHistory} onChange={(value) => handleDataChange("medicalHistory", value)} />;
            default:
                return "Unknown step";
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Box width="50%" p={4} boxShadow={3} borderRadius={10} bgcolor="#FFFFFF">
                <Typography variant="h6" align="center" gutterBottom>
                    Client Onboarding
                </Typography>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => (
                        <Step key={index}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box mt={4}>{getStepContent(activeStep)}</Box>
                <Box mt={4} display="flex" justifyContent="space-between">
                    <Button disabled={activeStep === 0} onClick={handleBack}>
                        Back
                    </Button>
                    {activeStep === steps.length - 1 ? (
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handleNext}>
                            Next
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default ClientOnboarding;
