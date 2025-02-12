import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Grid } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PsychologyIcon from "@mui/icons-material/Psychology";

export default function RoleSelection() {
  const navigate = useNavigate();
 

  const handleRoleSelect = (role) => {
    const state = encodeURIComponent(JSON.stringify({role}));
    navigate(`/signup?state=${state}`);
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          p: 4,
          borderRadius: 2,
          marginTop: "10px",
          maxWidth: "1000px",
        }}
      >
        <Typography variant="h5" sx={{ mb: 4, fontWeight: "bold" }}>
          How do you want to use the platform?
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* Client Button */}
          <Grid item>
            <Button
              onClick={() => handleRoleSelect("client")}
              variant="outlined"
              sx={{
                width: 150,
                height: 150,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f0f0f0",
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
            >
              <PersonIcon sx={{ fontSize: 60, mb: 1 }} />
              <Typography>Client</Typography>
            </Button>
          </Grid>

          {/* Therapist Button */}
          <Grid item>
            <Button
              onClick={() => handleRoleSelect("therapist")}
              variant="outlined"
              sx={{
                width: 150,
                height: 150,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f0f0f0",
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
            >
              <PsychologyIcon sx={{ fontSize: 60, mb: 1 }} />
              <Typography>Therapist</Typography>
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
