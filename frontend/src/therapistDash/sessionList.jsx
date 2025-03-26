import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Snackbar,
  Avatar,
  Alert
} from '@mui/material';
import {
  DeleteOutline,
  EditOutlined,
  AccessTimeOutlined,
  NoteOutlined,
  CloseOutlined,
  CheckCircleOutline
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import useTherapistStore from '../store/therapistStore';
import Layout from '../therapistDash/layout';

const drawerWidth = 240;

export default function SessionsManagement() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [selectedTab, setSelectedTab] = useState('Sessions');
  const { therapist, sessions = [], fetchSessions, updateSessionNotes, markSessionComplete, deleteSession} = useTherapistStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Session states
  const [selectedSession, setSelectedSession] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openCompleteDialog, setOpenCompleteDialog] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  // Fetch sessions on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchSessions();
        setLoading(false);
        // If sessionId is provided in URL, open the edit dialog for that session
        if (sessionId) {
          const session = sessions.find(s => s._id === sessionId);
          if (session) {
            setSelectedSession(session);
            setSessionNotes(session.notes?.therapistNotes || '');
            setOpenEditDialog(true);
          }
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId, fetchSessions]); // Removed `sessions` from dependencies

  // Handle editing session notes
  const handleEdit = (session) => {
    setSelectedSession(session);
    setSessionNotes(session.notes?.therapistNotes || '');
    navigate(`/sessionList/${session._id}`, { replace: true });
    setOpenEditDialog(true);
  };

  const handleCloseEdit = () => {
    navigate('/sessionList', { replace: true });
    setOpenEditDialog(false);
  };

  const handleSaveNotes = async () => {
    try {
      await updateSessionNotes(selectedSession._id, sessionNotes);
      setAlertMessage('Session notes updated successfully');
      setAlertSeverity('success');
      setAlertOpen(true);
      navigate('/sessionList', { replace: true });
      setOpenEditDialog(false);
    } catch (err) {
      setAlertMessage('Failed to update session notes');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  // Handle deleting a session
  const handleDelete = (session) => {
    setSelectedSession(session);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async() => {
    try{
      const result = await deleteSession(selectedSession._id);
      if (result.success) {
        await fetchSessions();
        setAlertMessage('Session deleted successfully');
        setAlertSeverity('success');
        setAlertOpen(true);
    } else {
        setAlertMessage('Failed to delete session');
        setAlertSeverity('error');
        setAlertOpen(true);
    }
} catch (error) {
    console.error('Error deleting session:', error);
    setAlertMessage('An error occurred while deleting the session');
    setAlertSeverity('error');
    setAlertOpen(true);
} finally {
    setOpenDeleteDialog(false);
}
  };

  // Handle marking session as complete
  const handleCompleteSession = (session) => {
    setSelectedSession(session);
    navigate(`/sessionList/${session._id}`, { replace: true });
    setOpenCompleteDialog(true);
  };

  const confirmComplete = async () => {
    try {
      console.log('Marking session complete with ID:', selectedSession._id);
      await markSessionComplete(selectedSession._id);
      setAlertMessage('Session marked as completed');
      setAlertSeverity('success');
      setAlertOpen(true);
      navigate('/sessionList', { replace: true });
      setOpenCompleteDialog(false);
    } catch (err) {
      setAlertMessage('Failed to mark session as completed');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const formatSessionTime = (date, time, duration) => {
    const formattedDate = dayjs(`${date}T${time}`).format('MMM D, YYYY');
    const startTime = dayjs(`${date}T${time}`).format('h:mm A');
    const endTime = dayjs(`${date}T${time}`).add(duration, 'minute').format('h:mm A');
    return `${formattedDate} · ${startTime} - ${endTime}`;
  };

  return (
    <Layout
      drawerWidth={drawerWidth}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
      user={therapist}
    >
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          Sessions Management
        </Typography>
        <Button
          variant="contained"
          disableElevation
          sx={{
            bgcolor: 'black',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.8)',
            }
          }}
        >
          Schedule New Session
        </Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="h6">Your Sessions</Typography>
        </Box>
        <Divider />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
            {sessions.length === 0 ? (
              <ListItem>
                <ListItemText primary="No sessions found" />
              </ListItem>
            ) : (
              sessions.map((session, index) => (
                <React.Fragment key={session._id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      py: 2,
                      bgcolor: session.status === 'completed' ? '#f9f9f9' : 'white',
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: session.status === 'completed' ? '#9e9e9e' : '#1976d2' }}>
                        {session.clientId.fullname.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          {session.clientId.fullname}
                          {session.status === 'completed' && (
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{ ml: 1, px: 1, py: 0.5, bgcolor: '#e0e0e0', borderRadius: 1 }}
                            >
                              Completed
                            </Typography>
                          )}

                          {session.status === 'cancelled' && (
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{ ml: 1, px: 1, py: 0.5, bgcolor: 'red', borderRadius: 1 }}
                            >
                              Cancelled
                            </Typography>
                          )}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {session.therapy}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <AccessTimeOutlined sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {dayjs(session.scheduledTime).format('YYYY-MM-DD h:mm A')}
                            </Typography>
                          </Box>
                          {session.status === 'cancelled' && (
                            <>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Typography variant="body2" color="error" sx={{ fontWeight: 'medium' }}>
                                  Cancelled by: {session.cancellation.cancelledBy === 'client' ? 'Client' : 'Therapist'}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                ({dayjs(session.cancellation.cancelledAt).format('MMM D, YYYY')})
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Reason: {session.cancellation.reason || 'No reason provided'}
                                </Typography>
                              </Box>
                            </>
                          )}
                          {session.notes?.therapistNotes && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <NoteOutlined sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: '500px' }}>
                                {session.notes.therapistNotes}
                              </Typography>
                            </Box>
                          )}
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      {session.status === 'scheduled' && (
                        <IconButton
                          edge="end"
                          aria-label="mark-completed"
                          onClick={() => handleCompleteSession(session)}
                          sx={{ mr: 1, color: 'green' }}
                          title="Mark as completed"
                        >
                          <CheckCircleOutline />
                        </IconButton>
                      )}
                      <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(session)} sx={{ mr: 1 }}>
                        <EditOutlined />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(session)}>
                        <DeleteOutline />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < sessions.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))
            )}
          </List>
        )}
      </Paper>

      {/* Edit Notes Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEdit} fullWidth maxWidth="sm">
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Edit Session Notes
            <IconButton aria-label="close" onClick={handleCloseEdit}>
              <CloseOutlined />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedSession && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                {selectedSession.clientId.fullname} - {selectedSession.therapy}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {dayjs(selectedSession.scheduledTime).format('YYYY-MM-DD h:mm A')}
              </Typography>
              <TextField
                label="Session Notes"
                multiline
                rows={6}
                fullWidth
                margin="normal"
                variant="outlined"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Add notes about this session..."
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button
            onClick={handleSaveNotes}
            variant="contained"
            disableElevation
            sx={{
              bgcolor: 'black',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.8)',
              }
            }}
          >
            Save Notes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this session with {selectedSession?.clientId.fullname}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mark as Completed Confirmation Dialog */}
      <Dialog open={openCompleteDialog} onClose={() => setOpenCompleteDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Mark Session as Completed</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to mark this session with {selectedSession?.clientId.fullname} as completed?
          </Typography>
          {selectedSession && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {dayjs(selectedSession.scheduledTime).format('YYYY-MM-DD h:mm A')}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCompleteDialog(false)}>Cancel</Button>
          <Button
            onClick={confirmComplete}
            variant="contained"
            color="success"
            disableElevation
          >
            Mark as Completed
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar open={alertOpen} autoHideDuration={4000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Layout>
  );
}
