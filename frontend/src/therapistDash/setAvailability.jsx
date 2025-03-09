import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Alert,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Divider,
  Chip
} from '@mui/material';
import { 
  CalendarMonth as CalendarMonthIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Google as GoogleIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Event as EventIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';

const AvailabilityManagement = () => {
  // State for the availability slots
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  
  // State for the form data
  const [formData, setFormData] = useState({
    slots: [{ startDateTime: '', endDateTime: '', isAvailable: true }]
  });
  
  // State for dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  
  // State for snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // State for Google Calendar connection
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  
  // Handle Google Calendar connection
  const handleGoogleCalendarConnect = () => {
    // In a real app, this would initiate OAuth flow
    setIsCalendarConnected(true);
    setSnackbar({
      open: true,
      message: 'Google Calendar connected successfully!',
      severity: 'success'
    });
  };
  
  // Handle form input changes
  const handleAvailabilityChange = (slotIndex, e) => {
    const { name, value } = e.target;
    const updatedSlots = [...formData.slots];
    updatedSlots[slotIndex][name] = value;
    setFormData((prevData) => ({
      ...prevData,
      slots: updatedSlots,
    }));
  };
  
  // Add new slot to form
  const addNewSlot = () => {
    setFormData((prevData) => ({
      ...prevData,
      slots: [...prevData.slots, { startDateTime: '', endDateTime: '', isAvailable: true }],
    }));
  };
  
  // Open dialog for creating a new slot
  const handleOpenCreateDialog = () => {
    setFormData({
      slots: [{ startDateTime: '', endDateTime: '', isAvailable: true }]
    });
    setIsEditing(false);
    setOpenDialog(true);
  };
  
  // Open dialog for editing an existing slot
  const handleOpenEditDialog = (slot, index) => {
    setFormData({
      slots: [{ ...slot }]
    });
    setIsEditing(true);
    setEditIndex(index);
    setOpenDialog(true);
  };
  
  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentSlot(null);
    setIsEditing(false);
    setEditIndex(null);
  };
  
  // Save a new or edited slot
  const handleSaveSlot = () => {
    const newSlot = formData.slots[0];
    
    // Validate form
    if (!newSlot.startDateTime || !newSlot.endDateTime) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }
    
    if (isEditing && editIndex !== null) {
      // Update existing slot
      const updatedSlots = [...availabilitySlots];
      updatedSlots[editIndex] = newSlot;
      setAvailabilitySlots(updatedSlots);
      setSnackbar({
        open: true,
        message: 'Availability slot updated successfully!',
        severity: 'success'
      });
    } else {
      // Add new slot
      setAvailabilitySlots([...availabilitySlots, newSlot]);
      setSnackbar({
        open: true,
        message: 'New availability slot added successfully!',
        severity: 'success'
      });
    }
    
    handleCloseDialog();
  };
  
  // Delete a slot
  const handleDeleteSlot = (index) => {
    const updatedSlots = [...availabilitySlots];
    updatedSlots.splice(index, 1);
    setAvailabilitySlots(updatedSlots);
    setSnackbar({
      open: true,
      message: 'Availability slot deleted successfully!',
      severity: 'info'
    });
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Format date for display
  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return '';
    try {
      return format(parseISO(dateTimeString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateTimeString;
    }
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', my: 4 }}>
      {/* Calendar Connection Card */}
      {!isCalendarConnected && (
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 'md',
            p: 4,
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            mb: 4
          }}
        >
          <CalendarMonthIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Connect Your Calendar
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            To manage your therapy sessions efficiently, please connect your Google Calendar.
            This will help you set your availability and schedule appointments.
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            You need to connect your Google account to enable session scheduling and availability management.
          </Alert>
          <Button
            variant="contained"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleCalendarConnect}
            sx={{
              bgcolor: '#4285F4',
              color: 'white',
              '&:hover': {
                bgcolor: '#3367D6'
              },
              px: 4,
              py: 1.5,
              mb: 3
            }}
          >
            Connect Google Calendar
          </Button>
        </Paper>
      )}
      
      {/* Availability Section */}
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 'md',
          p: 4,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          mb: 4
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Manage Your Availability
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
            disabled={!isCalendarConnected}
          >
            Add Availability
          </Button>
        </Box>
        
        {isCalendarConnected && availabilitySlots.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <EventIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              You haven't set any availability slots yet. Click "Add Availability" to create your first slot.
            </Typography>
          </Box>
        )}
        
        {/* Availability Cards */}
        <Grid container spacing={2}>
          {availabilitySlots.map((slot, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                border: '1px solid',
                borderColor: slot.isAvailable ? 'success.light' : 'error.light',
                boxShadow: 'none'
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Availability Slot
                    </Typography>
                    <Chip 
                      label={slot.isAvailable ? "Available" : "Unavailable"}
                      color={slot.isAvailable ? "success" : "error"}
                      size="small"
                    />
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Start:</strong> {formatDate(slot.startDateTime)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>End:</strong> {formatDate(slot.endDateTime)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
                  <IconButton 
                    size="small" 
                    color="primary" 
                    onClick={() => handleOpenEditDialog(slot, index)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleDeleteSlot(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
      
      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Availability Slot' : 'Create New Availability Slot'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              name="startDateTime"
              label="Start Date & Time"
              type="datetime-local"
              value={formData.slots[0]?.startDateTime || ''}
              onChange={(e) => handleAvailabilityChange(0, e)}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              name="endDateTime"
              label="End Date & Time"
              type="datetime-local"
              value={formData.slots[0]?.endDateTime || ''}
              onChange={(e) => handleAvailabilityChange(0, e)}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.slots[0]?.isAvailable || false}
                  onChange={(e) =>
                    handleAvailabilityChange(0, {
                      target: { name: 'isAvailable', value: e.target.checked },
                    })
                  }
                />
              }
              label="Available"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button 
            onClick={handleSaveSlot} 
            color="primary" 
            variant="contained"
            startIcon={<SaveIcon />}
          >
            {isEditing ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        action={
          <IconButton size="small" color="inherit" onClick={handleCloseSnackbar}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default AvailabilityManagement;