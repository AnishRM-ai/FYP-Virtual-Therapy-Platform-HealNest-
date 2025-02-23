import React, { useState } from "react";
import { Box, Button, Typography, IconButton, Card, CardContent, MenuItem, Select, Alert } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AddCircle, Delete } from "@mui/icons-material";
import dayjs from "dayjs";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Availability = ({ onNext, onBack }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [error, setError] = useState(""); // Error message state

  const handleAddSlot = () => {
    if (!selectedDay || !startTime || !endTime) {
      setError("Please select a day, start time, and end time.");
      return;
    }

    if (startTime.isSame(endTime) || startTime.isAfter(endTime)) {
      setError("End time must be after start time.");
      return;
    }

    const newSlot = {
      startTime: startTime.format("HH:mm"),
      endTime: endTime.format("HH:mm"),
      isBooked: false,
    };

    // Check if the day already exists
    const existingDayIndex = availableSlots.findIndex((slot) => slot.day === selectedDay);

    if (existingDayIndex !== -1) {
      // Check if the slot already exists for this day
      const isDuplicate = availableSlots[existingDayIndex].slots.some(
        (slot) => slot.startTime === newSlot.startTime && slot.endTime === newSlot.endTime
      );

      if (isDuplicate) {
        setError("This time slot is already added for the selected day.");
        return;
      }

      // Add new slot to the existing day
      availableSlots[existingDayIndex].slots.push(newSlot);
      setAvailableSlots([...availableSlots]);
    } else {
      // Add new day with the slot
      setAvailableSlots([...availableSlots, { day: selectedDay, slots: [newSlot] }]);
    }

    // Clear inputs and error message
    setSelectedDay("");
    setStartTime(null);
    setEndTime(null);
    setError("");
  };

  const handleRemoveSlot = (dayIndex, slotIndex) => {
    setAvailableSlots((prevSlots) => {
      const updatedSlots = [...prevSlots];
      updatedSlots[dayIndex].slots.splice(slotIndex, 1);
      if (updatedSlots[dayIndex].slots.length === 0) updatedSlots.splice(dayIndex, 1);
      return updatedSlots;
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Set Your Availability
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Select
          fullWidth
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          displayEmpty
          sx={{ mb: 2, borderRadius: "10px" }}
        >
          <MenuItem value="" disabled>Select Day</MenuItem>
          {daysOfWeek.map((day) => (
            <MenuItem key={day} value={day}>{day}</MenuItem>
          ))}
        </Select>

        <TimePicker
          label="Start Time"
          value={startTime}
          onChange={setStartTime}
          sx={{ width: "100%", mb: 2 }}
        />
        <TimePicker
          label="End Time"
          value={endTime}
          onChange={setEndTime}
          sx={{ width: "100%", mb: 2 }}
        />

        <Button variant="contained" startIcon={<AddCircle />} onClick={handleAddSlot} fullWidth sx={{ mb: 3 }}>
          Add Slot
        </Button>

        {availableSlots.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Available Slots:
            </Typography>
            {availableSlots.map((slot, dayIndex) => (
              <Box key={slot.day} sx={{ mb: 2 }}>
                <Typography variant="subtitle1"><b>{slot.day}</b></Typography>
                {slot.slots.map((timeSlot, slotIndex) => (
                  <Card key={slotIndex} sx={{ display: "flex", justifyContent: "space-between", p: 2, mb: 1, borderRadius: 2, boxShadow: 2 }}>
                    <CardContent>
                      <Typography variant="body1">
                        {timeSlot.startTime} - {timeSlot.endTime}
                      </Typography>
                    </CardContent>
                    <IconButton onClick={() => handleRemoveSlot(dayIndex, slotIndex)}>
                      <Delete color="error" />
                    </IconButton>
                  </Card>
                ))}
              </Box>
            ))}
          </Box>
        )}

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={() => onNext({ availability: availableSlots })}
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
