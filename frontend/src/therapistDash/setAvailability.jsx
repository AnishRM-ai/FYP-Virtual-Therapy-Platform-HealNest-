import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  Stack,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import {
  HomeOutlined,
  CalendarMonthOutlined,
  PeopleOutlined,
  MessageOutlined,
  AccessTimeOutlined,
  CheckCircleOutlined,
  StarOutlined,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import useTherapistStore from '../store/therapistStore';
import dayjs from "dayjs";
import Layout from "./layout";

// Component for the availability section
const AvailabilitySection = () => {
  const {
    availability,
    loading,
    error,
    therapist,
    fetchAuthenticatedAvailability,
    addUpdateAvailability,
    deleteAvailability
  } = useTherapistStore();

  // State for modals
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Form state
  const [formData, setFormData] = useState({
    date: dayjs(),
    startTime: dayjs().hour(9).minute(0),
    endTime: dayjs().hour(10).minute(0),
    isAvailable: true,
    timezone: 'GMT'
  });

  // Extract the authenticated therapist's availability slots
  const therapistAvailability = therapist && availability[therapist._id] ? availability[therapist._id] : null;
  const slots = therapistAvailability && therapistAvailability.slots ? therapistAvailability.slots : [];

  // Function to handle opening the create modal
  const handleOpenCreateModal = () => {
    setFormData({
      date: dayjs(),
      startTime: dayjs().hour(9).minute(0),
      endTime: dayjs().hour(10).minute(0),
      isAvailable: true,
      timezone: 'GMT'
    });
    setOpenCreateModal(true);
  };

  // Function to handle opening the update modal
  const handleOpenUpdateModal = (slot) => {
    setSelectedSlot(slot);
    const slotDate = dayjs(slot.startDateTime);
    setFormData({
      date: slotDate,
      startTime: slotDate,
      endTime: dayjs(slot.endDateTime),
      isAvailable: slot.isAvailable,
      timezone: slot.timezone || 'GMT'
    });
    setOpenUpdateModal(true);
  };

  // Function to handle opening the delete modal
  const handleOpenDeleteModal = (slot) => {
    setSelectedSlot(slot);
    setOpenDeleteModal(true);
  };

  // Function to handle form input changes
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Function to create a new availability slot
  const handleCreateSlot = async () => {
    try {
      // Create the start and end date times
      const startDateTime = formData.date
        .hour(formData.startTime.hour())
        .minute(formData.startTime.minute())
        .second(0)
        .millisecond(0);
      
      const endDateTime = formData.date
        .hour(formData.endTime.hour())
        .minute(formData.endTime.minute())
        .second(0)
        .millisecond(0);

      // Prepare the data for the API call
      const newSlot = {
        slots: [
          {
            startDateTime: startDateTime.toISOString(),
            endDateTime: endDateTime.toISOString(),
            isAvailable: formData.isAvailable
          }
        ],
        timezone: formData.timezone,
        isAvailable: formData.isAvailable
      };

      // Call the API to create the slot
      await addUpdateAvailability(newSlot);
      
      // Close the modal and show success message
      setOpenCreateModal(false);
      setSnackbar({
        open: true,
        message: 'Availability slot created successfully!',
        severity: 'success'
      });
      
      // Refresh the availability data
      fetchAuthenticatedAvailability();
    } catch (error) {
      console.error('Error creating availability slot:', error);
      setSnackbar({
        open: true,
        message: 'Failed to create availability slot.',
        severity: 'error'
      });
    }
  };

  // Function to update an existing availability slot
  const handleUpdateSlot = async () => {
    try {
      // Create the start and end date times
      const startDateTime = formData.date
        .hour(formData.startTime.hour())
        .minute(formData.startTime.minute())
        .second(0)
        .millisecond(0);
      
      const endDateTime = formData.date
        .hour(formData.endTime.hour())
        .minute(formData.endTime.minute())
        .second(0)
        .millisecond(0);

      // Prepare the data for the API call
      const updatedSlot = {
        slots: [
          {
            startDateTime: startDateTime.toISOString(),
            endDateTime: endDateTime.toISOString(),
            isAvailable: formData.isAvailable
          }
        ],
        timezone: formData.timezone,
        isAvailable: formData.isAvailable
      };

      // Call the API to update the slot
      await addUpdateAvailability(updatedSlot);
      
      // Close the modal and show success message
      setOpenUpdateModal(false);
      setSnackbar({
        open: true,
        message: 'Availability slot updated successfully!',
        severity: 'success'
      });
      
      // Refresh the availability data
      fetchAuthenticatedAvailability();
    } catch (error) {
      console.error('Error updating availability slot:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update availability slot.',
        severity: 'error'
      });
    }
  };

  // Function to delete an availability slot
  const handleDeleteSlot = async () => {
    try {
      // Call the API to delete the slot
      await deleteAvailability(selectedSlot.startDateTime);
      
      // Close the modal and show success message
      setOpenDeleteModal(false);
      setSnackbar({
        open: true,
        message: 'Availability slot deleted successfully!',
        severity: 'success'
      });
      
      // Refresh the availability data
      fetchAuthenticatedAvailability();
    } catch (error) {
      console.error('Error deleting availability slot:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete availability slot.',
        severity: 'error'
      });
    }
  };

  // Function to close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const drawerWidth= 240;
  // Availability section content
  return (
    <Grid item xs={6}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
            Available Time Slots
          </Typography>
          <Button
            variant="outlined"
            startIcon={<CalendarMonthOutlined />}
            onClick={handleOpenCreateModal}
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            Add New Slot
          </Button>
        </Box>

        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}

        {!loading && !error && slots && slots.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {slots.map((slot, index) => (
              <Card
                key={index}
                sx={{
                  minWidth: 120,
                  maxWidth: 150,
                  boxShadow: 2,
                  border: "1px solid",
                  borderColor: "primary.light",
                  borderRadius: 2,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                  "&:hover": { 
                    transform: "translateY(-3px)",
                    boxShadow: 4,
                    borderColor: "primary.main"
                  },
                  position: "relative"
                }}
                onClick={() => handleOpenUpdateModal(slot)}
              >
                <CardContent sx={{ textAlign: "center", p: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Box sx={{ 
                    backgroundColor: "primary.light", 
                    py: 0.5, 
                    borderRadius: 1,
                    mb: 1.5,
                    color: "primary.dark"
                  }}>
                    <Typography variant="body2" fontWeight="bold">
                      {dayjs(slot.startDateTime).format("MMM D, YYYY")}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 0.5 }}>
                    <AccessTimeOutlined sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      {dayjs(slot.startDateTime).format("HH:mm")} - {dayjs(slot.endDateTime).format("HH:mm")}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ 
                    display: "inline-block", 
                    backgroundColor: slot.isAvailable ? "success.light" : "error.light", 
                    color: slot.isAvailable ? "success.dark" : "error.dark",
                    px: 1,
                    py: 0.25,
                    borderRadius: 5,
                    mt: 0.5
                  }}>
                    {slot.isAvailable ? "Available" : "Unavailable"}
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDeleteModal(slot);
                    }}
                  >
                    <DeleteIcon fontSize="small" sx={{ color: "error.main" }} />
                  </IconButton>
                </CardContent>
              </Card>
            ))}
            <Card
              sx={{
                minWidth: 120,
                maxWidth: 150,
                height: "100%",
                boxShadow: 1,
                border: "1px dashed",
                borderColor: "grey.400",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backgroundColor: "grey.50",
                transition: "background-color 0.2s",
                "&:hover": { 
                  backgroundColor: "grey.100",
                },
              }}
              onClick={handleOpenCreateModal}
            >
              <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 1.5 }}>
                <Box sx={{ border: "1px solid", borderColor: "grey.400", borderRadius: "50%", p: 1, mb: 1 }}>
                  <AddIcon sx={{ color: "grey.600" }} />
                </Box>
                <Typography variant="body2" color="text.secondary" align="center">
                  Add new slot
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ) : (
          !loading && !error && 
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>No available slots found.</Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleOpenCreateModal}
              sx={{
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }}
            >
              Create Your First Slot
            </Button>
          </Box>
        )}

        {/* Create Slot Modal */}
        <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              Create New Availability Slot
              <IconButton onClick={() => setOpenCreateModal(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ mt: 2 }}>
                <DatePicker
                  label="Date"
                  value={formData.date}
                  onChange={(newValue) => handleInputChange('date', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                  sx={{ width: '100%', mb: 2 }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <TimePicker
                  label="Start Time"
                  value={formData.startTime}
                  onChange={(newValue) => handleInputChange('startTime', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  sx={{ width: '50%' }}
                />
                <TimePicker
                  label="End Time"
                  value={formData.endTime}
                  onChange={(newValue) => handleInputChange('endTime', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  sx={{ width: '50%' }}
                />
              </Box>
            </LocalizationProvider>
            <FormControl fullWidth margin="normal">
              <InputLabel>Timezone</InputLabel>
              <Select
                value={formData.timezone}
                label="Timezone"
                onChange={(e) => handleInputChange('timezone', e.target.value)}
              >
                <MenuItem value="GMT">GMT</MenuItem>
                <MenuItem value="EST">EST</MenuItem>
                <MenuItem value="PST">PST</MenuItem>
                <MenuItem value="CST">CST</MenuItem>
                <MenuItem value="MST">MST</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isAvailable}
                    onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                    color="primary"
                  />
                }
                label="Available"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreateModal(false)} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleCreateSlot} variant="contained" color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>

        {/* Update Slot Modal */}
        <Dialog open={openUpdateModal} onClose={() => setOpenUpdateModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              Update Availability Slot
              <IconButton onClick={() => setOpenUpdateModal(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ mt: 2 }}>
                <DatePicker
                  label="Date"
                  value={formData.date}
                  onChange={(newValue) => handleInputChange('date', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                  sx={{ width: '100%', mb: 2 }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <TimePicker
                  label="Start Time"
                  value={formData.startTime}
                  onChange={(newValue) => handleInputChange('startTime', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  sx={{ width: '50%' }}
                />
                <TimePicker
                  label="End Time"
                  value={formData.endTime}
                  onChange={(newValue) => handleInputChange('endTime', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  sx={{ width: '50%' }}
                />
              </Box>
            </LocalizationProvider>
            <FormControl fullWidth margin="normal">
              <InputLabel>Timezone</InputLabel>
              <Select
                value={formData.timezone}
                label="Timezone"
                onChange={(e) => handleInputChange('timezone', e.target.value)}
              >
                <MenuItem value="GMT">GMT</MenuItem>
                <MenuItem value="EST">EST</MenuItem>
                <MenuItem value="PST">PST</MenuItem>
                <MenuItem value="CST">CST</MenuItem>
                <MenuItem value="MST">MST</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isAvailable}
                    onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                    color="primary"
                  />
                }
                label="Available"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => handleOpenDeleteModal(selectedSlot)} 
              color="error" 
              startIcon={<DeleteIcon />}
              sx={{ marginRight: 'auto' }}
            >
              Delete
            </Button>
            <Button onClick={() => setOpenUpdateModal(false)} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleUpdateSlot} variant="contained" color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              Delete Availability Slot
              <IconButton onClick={() => setOpenDeleteModal(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this availability slot?
            </Typography>
            {selectedSlot && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Date:</strong> {dayjs(selectedSlot.startDateTime).format("MMM D, YYYY")}
                </Typography>
                <Typography variant="body2">
                  <strong>Time:</strong> {dayjs(selectedSlot.startDateTime).format("HH:mm")} - {dayjs(selectedSlot.endDateTime).format("HH:mm")}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteModal(false)} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleDeleteSlot} variant="contained" color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Grid>
  );
};

export default AvailabilitySection;