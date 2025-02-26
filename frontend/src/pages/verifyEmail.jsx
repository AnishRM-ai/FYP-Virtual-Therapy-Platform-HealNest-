import React, { useRef, useState } from "react";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  // Create refs for each input field
  const inputRefs = useRef([]);
  const [code, setCode] = useState(Array(6).fill(""));
  const navigate = useNavigate();

  const {error, verifyEmail, } = useAuthStore();

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    if(/^\d?$/.test(value)) {
      const updatedCode = [...code];
      updatedCode[index] = value;
      setCode(updatedCode);
    }

    // Move focus to the next input if a digit is entered
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Handle backspace to move to the previous input
    if (!value && e.key === "Backspace" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const verificationCode = code.join("");
  console.log(verificationCode);
  if(verificationCode.length < 6) {
    alert("Please enter the full code");
    return;
  }
  try{
    const response = await verifyEmail(verificationCode);
    toast.success("Email verified successfully.")
    console.log(response);
    navigate('/signin');
    
    
  }catch (error){
    console.log(error);
  }
    
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to bottom, #6cb5ff, #d4a1ff)",
      }}
    >
      <Box
        sx={{
          width: "400px",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: "16px" }}>
          Verify Your Email
        </Typography>
        <Typography sx={{ marginBottom: "24px", color: "#6b6b6b" }}>
          Enter the 6-digit code sent to your email address.
        </Typography>
        {error && (
                <Alert severity="error" sx={{ width: "100%", maxWidth: 400 }}>
                  {error}
                </Alert>
              )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "24px",
            gap: "10px",
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <TextField
              key={index}
              variant="outlined"
              inputRef={(el) => (inputRefs.current[index] = el)} // Assign ref
              onChange={(e) => handleInputChange(e, index)} // Handle input change
              onKeyDown={(e) => handleKeyDown(e, index)} // Handle backspace
              inputProps={{
                maxLength: 1,
                style: { textAlign: "center", fontSize: "18px", width: "35px" },
              }}
            />
          ))}
        </Box>
        <Button
          variant="contained"
          type="submit"
          onClick={handleSubmit}
          fullWidth
          sx={{
            backgroundColor: "#b084f7",
            "&:hover": { backgroundColor: "#9d74e8" },
            textTransform: "none",
            fontSize: "16px",
          }}
        >
          Verify Email
        </Button>
      </Box>
    </Box>
  );
};

export default VerifyEmail;
