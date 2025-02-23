import React, { useState } from "react";
import { Container, Card, CardContent, Typography, Button, Avatar, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const therapists = [
  {
    id: "1",
    name: "Dr. Smith",
    specialization: "Psychologist",
    price: "$100",
    rating: 4.8,
    verified: true,
    profilePic: "https://via.placeholder.com/150"
  },
  {
    id: "2",
    name: "Dr. Johnson",
    specialization: "Counselor",
    price: "$120",
    rating: 4.7,
    verified: true,
    profilePic: "https://via.placeholder.com/150"
  }
];

const FindTherapist = () => {
  const navigate = useNavigate();

  const handleSelectTherapist = (id) => {
    navigate(`/book-appointment/${id}`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Find a Therapist
      </Typography>
      {therapists.map((therapist) => (
        <Card key={therapist.id} sx={{ mb: 3, p: 2, display: "flex", alignItems: "center", boxShadow: 3 }}>
          <Avatar src={therapist.profilePic} sx={{ width: 80, height: 80, mr: 2 }} />
          <CardContent>
            <Typography variant="h6">{therapist.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {therapist.specialization}
            </Typography>
            <Typography variant="body1">Session Price: {therapist.price}</Typography>
            <Typography variant="body1">Rating: ⭐{therapist.rating}</Typography>
            {therapist.verified && <Typography variant="body2" color="primary">✔ Verified</Typography>}
            <Box mt={1}>
              <Button variant="contained" color="primary" onClick={() => handleSelectTherapist(therapist.id)}>
                View Profile & Book
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default FindTherapist;
