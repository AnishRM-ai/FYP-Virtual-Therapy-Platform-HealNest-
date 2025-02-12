import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Switch,
  Divider,
  Avatar,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const AppointmentBooking = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState("10-11 AM");
  const [collectSamples, setCollectSamples] = useState(false);
  const [bookForChandu, setBookForChandu] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  const availableSlots = [
    { day: "Sunday", slots: ["10-11 AM", "3-4 PM"] },
    { day: "Monday", slots: ["3-4 PM", "Booked"] },
    { day: "Tuesday", slots: ["Not Available"] },
  ];

  const handleSubmit = () => {
    const dateStr = selectedDate.format("YYYY-MM-DD");
    const newBooking = `${dateStr} ${selectedTime}`;
    if (!bookedSlots.includes(newBooking)) {
      setBookedSlots([...bookedSlots, newBooking]);
      alert(`Appointment booked for ${dateStr} at ${selectedTime}`);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ width: 56, height: 56, mr: 2 }}>J</Avatar>
              <div>
                <Typography variant="h6">Joe Nelson</Typography>
                <Typography variant="body2">Psychotherapy Expert</Typography>
                <Typography variant="body2">Masters in Psychology</Typography>
                <Typography variant="body2">Email: joe@example.com</Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Left Panel: Slot Selection */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6">Select a Slot</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={(date) => setSelectedDate(dayjs(date))}
                  sx={{ width: "100%", mt: 2 }}
                />
              </LocalizationProvider>
              <Typography variant="h6" sx={{ mt: 3 }}>Select Time</Typography>
              <Grid container spacing={1} sx={{ mt: 1 }}>
                {["08-09 AM", "10-11 AM", "11-12 AM", "04-06 PM"].map((time) => (
                  <Grid item key={time}>
                    <Button
                      variant={selectedTime === time ? "contained" : "outlined"}
                      onClick={() => setSelectedTime(time)}
                      disabled={bookedSlots.includes(`${selectedDate.format("YYYY-MM-DD")} ${time}`)}
                    >
                      {time}
                    </Button>
                  </Grid>
                ))}
              </Grid>

              <FormControlLabel
                control={<Checkbox checked={collectSamples} onChange={() => setCollectSamples(!collectSamples)} />}
                label="Collect samples from home (₹50 extra)"
                sx={{ mt: 2 }}
              />

              <TextField fullWidth label="Mobile Number" sx={{ mt: 2 }} />
              <Typography variant="h6" sx={{ mt: 3 }}>Book for Family Member</Typography>
              <FormControlLabel
                control={<Switch checked={bookForChandu} onChange={() => setBookForChandu(!bookForChandu)} />}
                label="Book for Chandu"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6">Available Slots</Typography>
              {availableSlots.map((slot) => (
                <Typography key={slot.day} sx={{ mt: 1 }}>
                  <strong>{slot.day}:</strong> {slot.slots.join(", ")}
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Panel: Booking Details */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6">Booking Details</Typography>
              <Typography sx={{ mt: 2 }}>Complete Blood Picture (CBP) - ₹700</Typography>
              <Typography>Health Men Test - ₹2800</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography>
                <strong>Test Center:</strong> Thyrocare, Kavuri Hills, Hyderabad
              </Typography>
              <Typography sx={{ mt: 2 }}>
                <strong>Date & Time:</strong> {selectedDate.format("DD MMM YYYY")} at {selectedTime}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                <strong>Total Amount:</strong> ₹6250
              </Typography>
              <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
                Proceed to Pay
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AppointmentBooking;
