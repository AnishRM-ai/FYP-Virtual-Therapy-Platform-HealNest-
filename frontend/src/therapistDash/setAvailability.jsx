import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Alert, IconButton, Grid, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, Snackbar, Divider, Chip, Toolbar
} from '@mui/material';
import {
  HomeOutlined, CalendarMonthOutlined, PeopleOutlined, MessageOutlined, AccessTimeOutlined, Edit as EditIcon, Delete as DeleteIcon, Google as GoogleIcon, Save as SaveIcon, Add as AddIcon, Event as EventIcon, Close as CloseIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import Layout from './layout';
import useTherapistStore from '../store/therapistStore.js';
import dayjs from 'dayjs';

const AvailabilityManagement = () => {
  const { therapist, availability, fetchAuthenticatedAvailability, addUpdateAvailability, deleteAvailability, loading, error } = useTherapistStore();
  const [selectedTab, setSelectedTab] = useState('Availability');
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [formData, setFormData] = useState({ slots: [{ startDateTime: '', endDateTime: '', isAvailable: true }] });
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);

  const sidebarItems = [
    { text: 'Dashboard', icon: <HomeOutlined /> },
    { text: 'Sessions', icon: <CalendarMonthOutlined /> },
    { text: 'Patients', icon: <PeopleOutlined /> },
    { text: 'Messages', icon: <MessageOutlined /> },
    { text: 'Availability', icon: <AccessTimeOutlined /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      await fetchAuthenticatedAvailability();
      console.log('Fetched availability:', availability[therapist?.id]);
      setAvailabilitySlots(availability[therapist?.id] || []);
    };

    fetchData();
  }, [fetchAuthenticatedAvailability, therapist?.id, availability]);

  const handleGoogleCalendarConnect = () => {
    setIsCalendarConnected(true);
    setSnackbar({ open: true, message: 'Google Calendar connected successfully!', severity: 'success' });
  };

  const handleAvailabilityChange = (slotIndex, e) => {
    const { name, value } = e.target;
    const updatedSlots = [...formData.slots];
    updatedSlots[slotIndex][name] = value;
    setFormData((prevData) => ({ ...prevData, slots: updatedSlots }));
  };

  const addNewSlot = () => {
    setFormData((prevData) => ({
      ...prevData,
      slots: [...prevData.slots, { startDateTime: '', endDateTime: '', isAvailable: true }],
    }));
  };

  const handleOpenCreateDialog = () => {
    setFormData({ slots: [{ startDateTime: '', endDateTime: '', isAvailable: true }] });
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (slot, index) => {
    setFormData({ slots: [{ ...slot }] });
    setIsEditing(true);
    setEditIndex(index);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentSlot(null);
    setIsEditing(false);
    setEditIndex(null);
  };

  const handleSaveSlot = async () => {
    const newSlot = formData.slots[0];
    if (!newSlot.startDateTime || !newSlot.endDateTime) {
      setSnackbar({ open: true, message: 'Please fill in all required fields', severity: 'error' });
      return;
    }

    try {
      if (isEditing && editIndex !== null) {
        await addUpdateAvailability({ slots: [newSlot], timezone: 'UTC', isAvailable: newSlot.isAvailable });
        setSnackbar({ open: true, message: 'Availability slot updated successfully!', severity: 'success' });
      } else {
        await addUpdateAvailability({ slots: [newSlot], timezone: 'UTC', isAvailable: newSlot.isAvailable });
        setSnackbar({ open: true, message: 'New availability slot added successfully!', severity: 'success' });
      }
      // Re-fetch availability to ensure UI is in sync
      await fetchAuthenticatedAvailability();
      console.log('Updated availability:', availability[therapist?.id]);
      setAvailabilitySlots(availability[therapist?.id] || []);
      handleCloseDialog();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to save availability slot', severity: 'error' });
    }
  };

  const handleDeleteSlot = async (index) => {
    const slotToDelete = availabilitySlots[index];
    try {
      await deleteAvailability(slotToDelete.startDateTime);
      // Re-fetch availability to ensure UI is in sync
      await fetchAuthenticatedAvailability();
      console.log('Deleted availability:', availability[therapist?.id]);
      setAvailabilitySlots(availability[therapist?.id] || []);
      setSnackbar({ open: true, message: 'Availability slot deleted successfully!', severity: 'info' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete availability slot', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return '';
    try {
      return format(parseISO(dateTimeString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateTimeString;
    }
  };

  const availabilityContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', my: 4 }}>
      <Box sx={{ width: '100%', maxWidth: 'md', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Availability Management</Typography>
      </Box>

      {!isCalendarConnected && (
        <Paper elevation={0} sx={{ width: '100%', maxWidth: 'md', p: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 4 }}>
          <CalendarMonthOutlined sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom fontWeight="bold">Connect Your Calendar</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            To manage your therapy sessions efficiently, please connect your Google Calendar. This will help you set your availability and schedule appointments.
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            You need to connect your Google account to enable session scheduling and availability management.
          </Alert>
          <Button variant="contained" size="large" startIcon={<GoogleIcon />} onClick={handleGoogleCalendarConnect} sx={{ bgcolor: '#4285F4', color: 'white', '&:hover': { bgcolor: '#3367D6' }, px: 4, py: 1.5, mb: 3 }}>
            Connect Google Calendar
          </Button>
        </Paper>
      )}

      <Paper elevation={0} sx={{ width: '100%', maxWidth: 'md', p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">Manage Your Availability</Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenCreateDialog} disabled={!isCalendarConnected}>
            Add Availability
          </Button>
        </Box>

        {!loading && !error && availabilitySlots && availabilitySlots.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {availabilitySlots.map((slot, index) => (
              <Card
                key={index}
                sx={{
                  minWidth: 120,
                  maxWidth: 150,
                  p: 1,
                  boxShadow: 1,
                  border: "1px solid",
                  borderColor: "grey.300",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 3 },
                }}
              >
                <CardContent sx={{ textAlign: "center", p: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {dayjs(slot.startDateTime).format("MMM D, YYYY")}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {dayjs(slot.startDateTime).format("HH:mm")} -{" "}
                    {dayjs(slot.endDateTime).format("HH:mm")}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
                  <IconButton size="small" color="primary" onClick={() => handleOpenEditDialog(slot, index)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeleteSlot(index)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Box>
        ) : (
          !loading && !error && <Typography>No available slots found.</Typography>
        )}
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Availability Slot' : 'Create New Availability Slot'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField name="startDateTime" label="Start Date & Time" type="datetime-local" value={formData.slots[0]?.startDateTime || ''} onChange={(e) => handleAvailabilityChange(0, e)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
            <TextField name="endDateTime" label="End Date & Time" type="datetime-local" value={formData.slots[0]?.endDateTime || ''} onChange={(e) => handleAvailabilityChange(0, e)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
            <FormControlLabel control={<Checkbox checked={formData.slots[0]?.isAvailable || false} onChange={(e) => handleAvailabilityChange(0, { target: { name: 'isAvailable', value: e.target.checked } })} />} label="Available" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button onClick={handleSaveSlot} color="primary" variant="contained" startIcon={<SaveIcon />}>{isEditing ? 'Update' : 'Save'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={handleCloseSnackbar} message={snackbar.message} action={<IconButton size="small" color="inherit" onClick={handleCloseSnackbar}><CloseIcon fontSize="small" /></IconButton>} />
    </Box>
  );

  const drawerWidth = 240;

  return (
    <Layout drawerWidth={drawerWidth} sidebarItems={sidebarItems} selectedTab={selectedTab} setSelectedTab={setSelectedTab} user={therapist}>
      {availabilityContent}
    </Layout>
  );
};

export default AvailabilityManagement;
