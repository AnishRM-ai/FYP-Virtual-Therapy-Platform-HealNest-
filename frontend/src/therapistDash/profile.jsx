import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Avatar, 
  Paper, 
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
  Chip,
  OutlinedInput
} from '@mui/material';
import { Save, PhotoCamera, Visibility, VisibilityOff, Add } from '@mui/icons-material';

const ProfileEditPage = () => {
  // User data state
  const [userData, setUserData] = useState({
    fullname: '',
    email: '',
    gender: '',
    bio: '',
    avatar: '',
    specializations: [],
  });

  // Available specializations
  const availableSpecializations = [
    'Anxiety', 'Depression', 'Trauma', 'PTSD', 'Addiction',
    'Relationships', 'Family Issues', 'Stress Management', 'Self-Esteem',
    'Grief', 'Career Counseling', 'Cognitive Behavioral Therapy (CBT)', 
    'Dialectical Behavior Therapy (DBT)', 'Mindfulness', 'Child Therapy'
  ];

  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  // Form validation
  const [errors, setErrors] = useState({});

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Mocked data - in a real app, this would be an API call
        setTimeout(() => {
          setUserData({
            fullname: 'John Doe',
            email: 'john.doe@example.com',
            gender: 'male',
            bio: 'I am a software developer with a passion for React and UX design.',
            avatar: '/api/placeholder/150/150',
            specializations: ['Anxiety', 'Depression', 'Stress Management'],
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setNotification({
          open: true,
          message: 'Failed to load user data',
          severity: 'error'
        });
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle input changes for profile info
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  // Handle specializations change
  const handleSpecializationsChange = (event) => {
    const {
      target: { value },
    } = event;
    // On autofill we get a stringified value.
    const specializations = typeof value === 'string' ? value.split(',') : value;
    setUserData({
      ...userData,
      specializations: specializations
    });
  };

  // Handle input changes for password
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value
    });
  };

  // Toggle password visibility
  const handleTogglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload this to a server
      // For now, just create a local URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserData({
          ...userData,
          avatar: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Validate email
    if (!userData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(userData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Validate fullname
    if (!userData.fullname) {
      newErrors.fullname = 'Full name is required';
    }
    
    // Validate password change if any password field is filled
    if (passwords.currentPassword || passwords.newPassword || passwords.confirmPassword) {
      if (!passwords.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      
      if (!passwords.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (passwords.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      
      if (!passwords.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your new password';
      } else if (passwords.newPassword !== passwords.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Mocked API call - in a real app, this would send data to your backend
      setTimeout(() => {
        setNotification({
          open: true,
          message: 'Profile updated successfully',
          severity: 'success'
        });
        
        // Clear password fields after successful update
        if (passwords.newPassword) {
          setPasswords({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        }
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        open: true,
        message: 'Failed to update profile',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Edit Profile
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Avatar Section */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <Avatar
              src={userData.avatar || '/api/placeholder/150/150'}
              alt={userData.fullname}
              sx={{ width: 150, height: 150, mb: 2 }}
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCamera />}
              size="small"
            >
              Change Avatar
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />
          
          {/* Personal Information Section */}
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="fullname"
                label="Full Name"
                value={userData.fullname}
                onChange={handleProfileChange}
                fullWidth
                error={!!errors.fullname}
                helperText={errors.fullname}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={userData.email}
                onChange={handleProfileChange}
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  name="gender"
                  value={userData.gender}
                  label="Gender"
                  onChange={handleProfileChange}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                  <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="specializations-label">Specializations</InputLabel>
                <Select
                  labelId="specializations-label"
                  id="specializations"
                  multiple
                  value={userData.specializations}
                  onChange={handleSpecializationsChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Specializations" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 224,
                        width: 250,
                      },
                    },
                  }}
                >
                  {availableSpecializations.map((specialization) => (
                    <MenuItem
                      key={specialization}
                      value={specialization}
                    >
                      {specialization}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="bio"
                label="Bio"
                multiline
                rows={4}
                value={userData.bio}
                onChange={handleProfileChange}
                fullWidth
                placeholder="Tell us about yourself..."
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />
          
          {/* Password Section */}
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12}>
              <TextField
                name="currentPassword"
                label="Current Password"
                type={showPassword.currentPassword ? 'text' : 'password'}
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                fullWidth
                error={!!errors.currentPassword}
                helperText={errors.currentPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleTogglePasswordVisibility('currentPassword')}
                        edge="end"
                      >
                        {showPassword.currentPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="newPassword"
                label="New Password"
                type={showPassword.newPassword ? 'text' : 'password'}
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                fullWidth
                error={!!errors.newPassword}
                helperText={errors.newPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleTogglePasswordVisibility('newPassword')}
                        edge="end"
                      >
                        {showPassword.newPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="confirmPassword"
                label="Confirm New Password"
                type={showPassword.confirmPassword ? 'text' : 'password'}
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleTogglePasswordVisibility('confirmPassword')}
                        edge="end"
                      >
                        {showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              startIcon={<Save />}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfileEditPage;