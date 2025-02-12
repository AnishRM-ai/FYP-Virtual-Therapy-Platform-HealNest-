import React, { useState, useEffect } from "react";
import { Container, TextField, Grid, Card, CardContent, Typography, Skeleton, Fade, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box } from "@mui/material";
import { motion } from "framer-motion";

const therapistsData = [
  { id: 1, name: "Dr. Emily Carter", specialty: "Cognitive Behavioral Therapy", slots: ["Monday 10:00 AM", "Wednesday 2:00 PM"] },
  { id: 2, name: "Dr. James Smith", specialty: "Mindfulness Therapy", slots: ["Tuesday 11:00 AM", "Thursday 3:00 PM"] },
  { id: 3, name: "Dr. Olivia Johnson", specialty: "Trauma Therapy", slots: ["Friday 1:00 PM", "Saturday 10:00 AM"] },
];

const TherapistSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setTherapists(therapistsData);
      setLoading(false);
    }, 2000);
  }, []);

  const handleOpen = (slots) => {
    setSelectedSlots(slots);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const filteredTherapists = therapists.filter((therapist) =>
    therapist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <TextField
        fullWidth
        label="Search Therapist"
        variant="outlined"
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Grid container spacing={3}>
        {loading
          ? Array.from(new Array(3)).map((_, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" width="80%" height={30} />
                    <Skeleton variant="text" width="60%" height={25} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : filteredTherapists.map((therapist) => (
              <Grid item xs={12} sm={6} key={therapist.id}>
                <Fade in timeout={500}>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Card elevation={3} sx={{ borderRadius: 2, p: 2 }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold">
                          {therapist.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                          {therapist.specialty}
                        </Typography>
                        <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => handleOpen(therapist.slots)}>
                          Book Now
                        </Button>
                        <Button variant="outlined" color="secondary">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Fade>
              </Grid>
            ))}
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Available Booking Slots</DialogTitle>
        <DialogContent>
          {selectedSlots.length > 0 ? (
            <Box>
              {selectedSlots.map((slot, index) => (
                <Button
                  key={index}
                  variant={selectedSlot === slot ? "contained" : "outlined"}
                  color="primary"
                  sx={{ display: "block", mb: 1, width: "100%" }}
                  onClick={() => handleSlotSelect(slot)}
                >
                  {slot}
                </Button>
              ))}
              {selectedSlot && (
                <Button variant="contained" color="success" sx={{ mt: 2, width: "100%" }}>
                  Book Now
                </Button>
              )}
            </Box>
          ) : (
            <Typography>No slots available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TherapistSearch;
