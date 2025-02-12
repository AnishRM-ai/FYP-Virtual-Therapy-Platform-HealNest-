import React, { useState } from "react";
import { Box, Button, Typography, IconButton, Card, CardContent } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AddCircle, Delete } from "@mui/icons-material";
import dayjs from "dayjs";

const Availability = ({ onNext, onBack }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  const handleAddSlot = () => {
    if (selectedDateTime) {
      setAvailableSlots([...availableSlots, selectedDateTime]);
      setSelectedDateTime(null);
    }
  };

  const handleRemoveSlot = (index) => {
    setAvailableSlots(availableSlots.filter((_, i) => i !== index));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Set Your Availability
        </Typography>

        <DateTimePicker
          label="Select Date & Time"
          value={selectedDateTime}
          onChange={setSelectedDateTime}
          disablePast
          // sx={{ width: "100%", mb: 2 }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",

            },
            width: "100%",
            mb:2
          }}
        />

        <Button
          variant="contained"
          startIcon={<AddCircle />}
          onClick={handleAddSlot}
          fullWidth
          sx={{ mb: 3 }}
        >
          Add Slot
        </Button>

        {availableSlots.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Available Slots:
            </Typography>
            {availableSlots.map((slot, index) => (
              <Card
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  mb: 1,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <CardContent>
                  <Typography variant="body1">
                    {dayjs(slot).format("MMMM D, YYYY - h:mm A")}
                  </Typography>
                </CardContent>
                <IconButton onClick={() => handleRemoveSlot(index)}>
                  <Delete color="error" />
                </IconButton>
              </Card>
            ))}
          </Box>
        )}

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={() => onNext({ availableSlots })}
            disabled={availableSlots.length === 0}
          >
            Next
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default Availability;
