import React, { useState, useMemo, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { Palette as PaletteIcon, LightMode as LightModeIcon, DarkMode as DarkModeIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ mode, setMode }) => {
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

  const navigate = useNavigate();

  const goToSignIn = () => {
    navigate('/signin');
  };

  const goToRoleSelection = () => {
    navigate('/select-role');
  };

  const findTherapist = () => {
    navigate('/therapist-search');
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" color="primary" component="div" sx={{ flexGrow: 1 }}>
            HealNest
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            <Button color="inherit" onClick={findTherapist}>Find Therapist</Button>
            <Button color="inherit">How It Works</Button>
            <Button color="inherit">Resources</Button>
            <Button color="inherit">About Us</Button>
          </Box>

          <IconButton
            onClick={handleThemeMenuClick}
            color="primary"
            aria-controls={open ? 'theme-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <PaletteIcon />
          </IconButton>

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

          <Button color="primary" sx={{ ml: 2 }} onClick={goToSignIn}>
            Sign In
          </Button>
          <Button variant="contained" color="primary" sx={{ ml: 2 }} onClick={goToRoleSelection}>
            Get Started
          </Button>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default NavBar;
