import React, { useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";

const PaymentSetup = ({ onNext, onBack }) => {
  const [data, setData] = useState({
    sessionPrice: "", // Ensure a default value
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Session Pricing
      </Typography>
      <TextField
        label="Session Price"
        name="sessionPrice"
        type="number"
        value={data.sessionPrice}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={() => onNext(data)}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentSetup;
