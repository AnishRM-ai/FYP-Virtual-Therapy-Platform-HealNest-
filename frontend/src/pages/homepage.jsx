import React, { useState, useMemo } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  TextField, 
  Box, 
  Rating, 
  Divider, 
  IconButton, 
  Paper,
  Switch,
  FormControlLabel,
  useMediaQuery,
  Menu,
  MenuItem
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Videocam as VideocamIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

const selectRole = () => {
    navigate('/select-role');
}

const TherapistCard = ({ name, title, rating, reviews, specialty, price, mode }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h4" component="h3" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Box display="flex" alignItems="center" mb={1}>
          <Rating value={rating} precision={0.1} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" ml={1}>
            ({reviews}+ reviews)
          </Typography>
        </Box>
        <Typography variant="body2" paragraph>
          {specialty}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color="primary">
            ${price}/session
          </Typography>
          <Button variant="contained" color="primary" size="small">
            Book Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const HomePage = () => {
  // State for theme mode (light/dark)
  const [mode, setMode] = useState('light');
  
  // Theme menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleThemeMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleThemeChange = (newMode) => {
    setMode(newMode);
    handleMenuClose();
  };

  // Create a theme instance based on the current mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#3f51b5' : '#90caf9',
          },
          secondary: {
            main: mode === 'light' ? '#f50057' : '#f48fb1',
          },
          background: {
            default: mode === 'light' ? '#ffffff' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
          },
          h2: {
            fontWeight: 700,
            fontSize: '2rem',
          },
          h3: {
            fontWeight: 600,
            fontSize: '1.5rem',
          },
          h4: {
            fontWeight: 600,
            fontSize: '1.25rem',
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 50,
                textTransform: 'none',
              },
            },
          },
        },
      }),
    [mode],
  );

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  React.useEffect(() => {
    // Initialize theme based on user's system preference
    if (prefersDarkMode) {
      setMode('dark');
    }
  }, [prefersDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        {/* Header */}
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <Typography
              variant="h6"
              color="primary"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              HealNest
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
              <Button color="inherit">Find Therapist</Button>
              <Button color="inherit">How It Works</Button>
              <Button color="inherit">Resources</Button>
              <Button color="inherit">About Us</Button>
            </Box>
            
            {/* Theme Toggle Button */}
            <IconButton 
              onClick={handleThemeMenuClick} 
              color="primary"
              aria-controls={open ? 'theme-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <PaletteIcon />
            </IconButton>
            
            {/* Theme selection menu */}
            <Menu
              id="theme-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'theme-button',
              }}
            >
              <MenuItem onClick={() => handleThemeChange('light')}>
                <LightModeIcon sx={{ mr: 1 }} />
                Light Mode
              </MenuItem>
              <MenuItem onClick={() => handleThemeChange('dark')}>
                <DarkModeIcon sx={{ mr: 1 }} />
                Dark Mode
              </MenuItem>
            </Menu>
            
            <Button color="primary" sx={{ ml: 2 }}>Sign In</Button>
            <Button variant="contained" color="primary" sx={{ ml: 2 }} onClick={selectRole}>
              Get Started
            </Button>
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h1" component="h1" gutterBottom>
                Your Journey to Mental Wellness Starts Here
              </Typography>
              <Typography variant="body1" paragraph>
                Connect with licensed therapists online. Book your virtual therapy sessions 
                easily and start your healing journey.
              </Typography>
              <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button variant="contained" color="primary" size="large">
                  Find a Therapist
                </Button>
                <Button variant="outlined" color="primary" size="large">
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box component="img" 
                src="/image/homan.png" 
                alt="Woman having online therapy session"
                sx={{ width: '100%' }}
              />
            </Grid>
          </Grid>

          {/* Search Bar */}
          <Box 
            component={Paper} 
            elevation={2} 
            sx={{ 
              mt: 6, 
              mx: 'auto', 
              maxWidth: 600, 
              borderRadius: 50,
              p: 0.5,
              display: 'flex'
            }}
          >
            <TextField
              fullWidth
              placeholder="Search by specialty, name, or issue"
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: { pl: 2 }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ 
                minWidth: 'unset', 
                width: 40, 
                height: 40, 
                borderRadius: '50%'
              }}
            >
              <SearchIcon />
            </Button>
          </Box>
        </Container>

        {/* Featured Therapists */}
        <Box sx={{ py: 8, bgcolor: mode === 'light' ? 'grey.100' : 'grey.900' }}>
          <Container maxWidth="lg">
            <Typography variant="h2" component="h2" align="center" gutterBottom sx={{ mb: 6 }}>
              Featured Therapists
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={4}>
                <TherapistCard 
                  name="Dr. Sarah Johnson"
                  title="Clinical Psychologist"
                  rating={4.9}
                  reviews="290"
                  specialty="Specializes in anxiety, depression, and trauma"
                  price={120}
                  mode={mode}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TherapistCard 
                  name="Dr. Michael Chen"
                  title="Psychiatrist"
                  rating={4.8}
                  reviews="150"
                  specialty="Specializes in mood disorders and ADHD"
                  price={150}
                  mode={mode}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TherapistCard 
                  name="Dr. Emily Rodriguez"
                  title="Family Therapist"
                  rating={4.9}
                  reviews="187"
                  specialty="Specializes in relationships and family issues"
                  price={130}
                  mode={mode}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* How It Works */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h2" component="h2" align="center" gutterBottom sx={{ mb: 6 }}>
            How It Works
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    bgcolor: 'primary.light', 
                    color: 'primary.main',
                    borderRadius: '50%',
                    width: 70,
                    height: 70,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    opacity: 0.2
                  }}
                >
                  <SearchIcon color="primary" fontSize="large" />
                </Box>
                <Typography variant="h3" component="h3" gutterBottom>
                  Find Your Therapist
                </Typography>
                <Typography>
                  Browse through our network of licensed therapists and find the right match for your needs
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    bgcolor: 'primary.light', 
                    color: 'primary.main',
                    borderRadius: '50%',
                    width: 70,
                    height: 70,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    opacity: 0.2
                  }}
                >
                  <CalendarIcon color="primary" fontSize="large" />
                </Box>
                <Typography variant="h3" component="h3" gutterBottom>
                  Book a Session
                </Typography>
                <Typography>
                  Choose your preferred date and time for your virtual therapy session
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    bgcolor: 'primary.light', 
                    color: 'primary.main',
                    borderRadius: '50%',
                    width: 70,
                    height: 70,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    opacity: 0.2
                  }}
                >
                  <VideocamIcon color="primary" fontSize="large" />
                </Box>
                <Typography variant="h3" component="h3" gutterBottom>
                  Start Your Session
                </Typography>
                <Typography>
                  Connect with your therapist via our secure video platform and begin your journey
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Footer */}
        <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 6 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={3}>
                <Typography variant="h6" gutterBottom>
                  HealNest
                </Typography>
                <Typography variant="body2" color="grey.400" paragraph>
                  Your trusted partner in mental wellness
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <IconButton size="small" sx={{ color: 'grey.500' }}>
                    <FacebookIcon />
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'grey.500' }}>
                    <TwitterIcon />
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'grey.500' }}>
                    <InstagramIcon />
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'grey.500' }}>
                    <LinkedInIcon />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="h6" gutterBottom>
                  Quick Links
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Button sx={{ color: 'grey.400', p: 0, textTransform: 'none' }}>
                      Find Therapist
                    </Button>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Button sx={{ color: 'grey.400', p: 0, textTransform: 'none' }}>
                      How It Works
                    </Button>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Button sx={{ color: 'grey.400', p: 0, textTransform: 'none' }}>
                      Resources
                    </Button>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Button sx={{ color: 'grey.400', p: 0, textTransform: 'none' }}>
                      About Us
                    </Button>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="h6" gutterBottom>
                  Support
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Button sx={{ color: 'grey.400', p: 0, textTransform: 'none' }}>
                      FAQ
                    </Button>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Button sx={{ color: 'grey.400', p: 0, textTransform: 'none' }}>
                      Contact Us
                    </Button>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Button sx={{ color: 'grey.400', p: 0, textTransform: 'none' }}>
                      Privacy Policy
                    </Button>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Button sx={{ color: 'grey.400', p: 0, textTransform: 'none' }}>
                      Terms of Service
                    </Button>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="h6" gutterBottom>
                  Connect With Us
                </Typography>
                <Typography variant="body2" color="grey.400">
                  support@healnest.com
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 4, borderColor: 'grey.800' }} />
            <Typography variant="body2" color="grey.500" align="center">
              © 2025 HealNest. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default HomePage;