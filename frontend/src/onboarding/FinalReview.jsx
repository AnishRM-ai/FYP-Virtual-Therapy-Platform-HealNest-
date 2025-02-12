import React from "react";
import { Box, Button, Typography } from "@mui/material";

const FinalReview = ({ onFinish, onBack }) => {
  return (
    <Box>
      <Typography variant="h6">Final Review</Typography>
      <Button onClick={onBack}>Back</Button>
      <Button onClick={onFinish}>Finish</Button>
    </Box>
  );
};

export default FinalReview;
