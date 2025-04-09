import React, { useEffect, useState } from 'react';
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
import { Save, PhotoCamera, Visibility, VisibilityOff } from '@mui/icons-material';
import useProfileStore from '../store/profileUpdateStore.js'; 
import NavBar from '../components/homenav.jsx';

const ProfileEditPage = () => {
  // Get state and actions from the Zustand store
  const { 
    profile,
    isLoading,
    error: storeError,
    avatarUrl,
    fetchProfile,
    updateProfile,
    changePassword,
    uploadAvatar,
    clearError
  } = useProfileStore();

  // Local state for form values
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    gender: '',
    bio: '',
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

  // Fetch user data from backend via Zustand store
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Update local form data when profile data is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        fullname: profile.fullname || '',
        email: profile.email || '',
        gender: profile.gender || '',
        bio: profile.bio || '',
        specializations: profile.specializations || [],
      });
    }
  }, [profile]);

  // Show error notification when store has error
  useEffect(() => {
    if (storeError) {
      setNotification({
        open: true,
        message: storeError,
        severity: 'error'
      });
      clearError();
    }
  }, [storeError, clearError]);

  // Handle input changes for profile info
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
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
    setFormData({
      ...formData,
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
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await uploadAvatar(file);
        setNotification({
          open: true,
          message: 'Avatar updated successfully',
          severity: 'success'
        });
      } catch (error) {
        setNotification({
          open: true,
          message: 'Failed to upload avatar',
          severity: 'error'
        });
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Validate fullname
    if (!formData.fullname) {
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
    
    try {
      // Update profile information
      await updateProfile(formData);
      
      // Change password if provided
      if (passwords.currentPassword && passwords.newPassword) {
        await changePassword({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        });
      }
      
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
    } catch (error) {
      console.error('Error updating profile:', error);
      // Error notifications are handled by the useEffect that watches storeError
    }
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  const drawerWidth=240;

  return (
   <Box sx={{ 
        minHeight: '100vh' 
      }}>
        <NavBar drawerWidth={drawerWidth}/>
    <Container maxWidth="md" sx={{ py: 4 }}>
       
      
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Edit Profile
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Avatar Section */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <Avatar
              src={avatarUrl || '/api/placeholder/150/150'}
              alt={formData.fullname}
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
                value={formData.fullname}
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
                value={formData.email}
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
                  value={formData.gender}
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
                  value={formData.specializations}
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
                value={formData.bio}
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
              disabled={isLoading}
              startIcon={<Save />}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
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
    </Box>
   
  );
};

export default ProfileEditPage;