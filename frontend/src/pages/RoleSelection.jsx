import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Link from '@mui/material/Link';

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    const state = encodeURIComponent(JSON.stringify({role}));
    navigate(`/signup?state=${state}`);
  };

  const roleCards = [
    {
      title: "I'm a Therapist",
      description: "Join as a mental health professional to provide online therapy services",
      features: [
        "Connect with clients worldwide",
        "Flexible scheduling system",
        "Secure payment processing"
      ],
      button: "Continue as Therapist",
      role: "therapist"
    },
    {
      title: "I'm Seeking Therapy",
      description: "Find and connect with licensed therapists for online sessions",
      features: [
        "Access to qualified professionals",
        "Convenient online sessions",
        "Confidential and secure"
      ],
      button: "Continue as Client",
      role: "client"
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Choose Your Role
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Select how you want to use the platform
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {roleCards.map((card, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card 
              variant="outlined" 
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                '&:hover': {
                  boxShadow: 1,
                }
              }}
            >
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                p: 4 
              }}>
                <Box 
                  sx={{ 
                    bgcolor: 'grey.100',
                    borderRadius: '50%',
                    p: 2,
                    mb: 2
                  }}
                >
                  <PersonOutlineIcon sx={{ fontSize: 40, color: 'grey.700' }} />
                </Box>

                <Typography variant="h5" component="h2" gutterBottom>
                  {card.title}
                </Typography>
                
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  textAlign="center" 
                  sx={{ mb: 3 }}
                >
                  {card.description}
                </Typography>

                <List sx={{ width: '100%', mb: 3 }}>
                  {card.features.map((feature, i) => (
                    <ListItem key={i} disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleRoleSelect(card.role)}
                  sx={{
                    mt: 'auto',
                    bgcolor: 'black',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'grey.900'
                    },
                    py: 1.5
                  }}
                >
                  {card.button}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account? {' '}
          <Link href="/signin" underline="hover" color="primary">
            Sign in
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}