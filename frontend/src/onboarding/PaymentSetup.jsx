import React, { useState } from "react";
import { Box, Button, Typography, TextField, Grid } from "@mui/material";

const PaymentSetup = ({ onNext, onBack }) => {
  const [data, setData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Setup
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Cardholder Name"
            name="cardholderName"
            fullWidth
            margin="normal"
            onChange={handleChange}
            value={data.cardholderName}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Card Number"
            name="cardNumber"
            fullWidth
            margin="normal"
            onChange={handleChange}
            value={data.cardNumber}
            inputProps={{ maxLength: 16 }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Expiration Date (MM/YY)"
            name="expiryDate"
            fullWidth
            margin="normal"
            onChange={handleChange}
            value={data.expiryDate}
            placeholder="MM/YY"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="CVV"
            name="cvv"
            fullWidth
            margin="normal"
            type="password"
            onChange={handleChange}
            value={data.cvv}
            inputProps={{ maxLength: 4 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Billing Address"
            name="billingAddress"
            fullWidth
            margin="normal"
            onChange={handleChange}
            value={data.billingAddress}
          />
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onNext(data)}
          disabled={!data.cardNumber || !data.expiryDate || !data.cvv}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentSetup;
