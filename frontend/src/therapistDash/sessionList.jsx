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
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent
} from '@mui/material';
import {
  DeleteOutline,
  EditOutlined,
  AccessTimeOutlined,
  NoteOutlined,
  CloseOutlined,
  CheckCircleOutline,
  HistoryOutlined,
  PersonOutlined,
  ShareOutlined,
  LockOutlined
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import useTherapistStore from '../store/therapistStore';
import Layout from '../therapistDash/layout';

const drawerWidth = 240;

// Custom TabPanel component for the session details dialog
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`session-tabpanel-${index}`}
      aria-labelledby={`session-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function SessionsManagement() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [selectedTab, setSelectedTab] = useState('Sessions');
  
  // Get the required functions and state from the therapist store
  const { 
    therapist, 
    sessions = [], 
    loading: storeLoading,
    error: storeError,
    fetchSessions, 
    updatePrivateNotes, 
    updateSharedNotes,
    markSessionComplete, 
    deleteSession,
    fetchClientSessionHistory
  } = useTherapistStore();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Session states
  const [selectedSession, setSelectedSession] = useState(null);
  const [openSessionDetailsDialog, setOpenSessionDetailsDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openCompleteDialog, setOpenCompleteDialog] = useState(false);
  const [privateNotes, setPrivateNotes] = useState('');
  const [sharedNotes, setSharedNotes] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  
  // New states for enhanced functionality
  const [detailsTabValue, setDetailsTabValue] = useState(0);
  const [pastSessions, setPastSessions] = useState([]);
  const [loadingPastSessions, setLoadingPastSessions] = useState(false);

  // Fetch sessions on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchSessions();
        setLoading(false);
        // If sessionId is provided in URL, open the session details dialog for that session
        if (sessionId) {
          const session = sessions.find(s => s._id === sessionId);
          if (session) {
            await handleViewSessionDetails(session);
          }
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId, fetchSessions]);

  // Handle viewing session details and fetching past sessions
  const handleViewSessionDetails = async (session) => {
    setSelectedSession(session);
    // Handle potential null notes structure
    setPrivateNotes(session.notes?.therapistNotes || '');
    setSharedNotes(session.notes?.sharedNotes || '');
    setDetailsTabValue(0); // Reset to first tab
    navigate(`/sessionList/${session._id}`, { replace: true });
    setOpenSessionDetailsDialog(true);
    
    // Fetch past sessions for this client
    try {
      setLoadingPastSessions(true);
      // Using fetchClientSessionHistory instead of fetchClientSessions
      const clientSessions = await fetchClientSessionHistory(session.clientId._id);
      
      // Filter out current session and sort by date (most recent first)
      const filteredSessions = clientSessions
        .filter(s => s._id !== session._id)
        .sort((a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime));
      
      setPastSessions(filteredSessions);
      setLoadingPastSessions(false);
    } catch (err) {
      console.error("Error fetching past sessions:", err);
      setLoadingPastSessions(false);
    }
  };

  const handleCloseSessionDetails = () => {
    navigate('/sessionList', { replace: true });
    setOpenSessionDetailsDialog(false);
  };

  const handleSaveNotes = async () => {
    try {
      // Update both types of notes
      await updatePrivateNotes(selectedSession._id, privateNotes);
      await updateSharedNotes(selectedSession._id, sharedNotes);
      
      setAlertMessage('Session notes updated successfully');
      setAlertSeverity('success');
      setAlertOpen(true);
      // Don't close the dialog automatically to allow user to continue viewing details
    } catch (err) {
      setAlertMessage('Failed to update session notes');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  // Handle changing tabs in session details dialog
  const handleChangeDetailsTab = (event, newValue) => {
    setDetailsTabValue(newValue);
  };

  // Handle deleting a session
  const handleDelete = (session) => {
    setSelectedSession(session);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async() => {
    try {
      const result = await deleteSession(selectedSession._id);
      if (result.success) {
        await fetchSessions();
        setAlertMessage('Session deleted successfully');
        setAlertSeverity('success');
        setAlertOpen(true);
        setOpenSessionDetailsDialog(false);
      } else {
        setAlertMessage(result.message || 'Failed to delete session');
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
      const result = await markSessionComplete(selectedSession._id);
      if (result && result.success !== false) {
        setAlertMessage('Session marked as completed');
        setAlertSeverity('success');
        setAlertOpen(true);
        navigate('/sessionList', { replace: true });
        setOpenCompleteDialog(false);
        setOpenSessionDetailsDialog(false);
        await fetchSessions();
      } else {
        setAlertMessage(result?.message || 'Failed to mark session as completed');
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    } catch (err) {
      setAlertMessage('Failed to mark session as completed');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  // Use the store's loading and error state if available
  const isLoading = loading || storeLoading;
  const errorMessage = error || storeError;

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
          onClick={() => navigate('/schedule-session')} // Assuming you have a route for scheduling
        >
          Schedule New Session
        </Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="h6">Your Sessions</Typography>
        </Box>
        <Divider />

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : errorMessage ? (
          <Box sx={{ p: 3 }}>
            <Typography color="error">{errorMessage}</Typography>
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
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: '#f0f7ff',
                      }
                    }}
                    onClick={() => handleViewSessionDetails(session)}
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
                          {(session.notes?.sharedNotes || session.notes?.therapistNotes) && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <NoteOutlined sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: '500px' }}>
                                Notes available
                              </Typography>
                            </Box>
                          )}
                        </>
                      }
                    />
                    <ListItemSecondaryAction onClick={(e) => e.stopPropagation()}>
                      {session.status === 'scheduled' && (
                        <IconButton
                          edge="end"
                          aria-label="mark-completed"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCompleteSession(session);
                          }}
                          sx={{ mr: 1, color: 'green' }}
                          title="Mark as completed"
                        >
                          <CheckCircleOutline />
                        </IconButton>
                      )}
                      <IconButton 
                        edge="end" 
                        aria-label="delete" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(session);
                        }}
                      >
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

      {/* Enhanced Session Details Dialog */}
      <Dialog 
        open={openSessionDetailsDialog} 
        onClose={handleCloseSessionDetails} 
        fullWidth 
        maxWidth="md"
        scroll="paper"
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Session Details</Typography>
            <IconButton aria-label="close" onClick={handleCloseSessionDetails}>
              <CloseOutlined />
            </IconButton>
          </Box>
        </DialogTitle>
        
        {selectedSession && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={detailsTabValue} 
                onChange={handleChangeDetailsTab}
                sx={{ px: 2 }}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab icon={<PersonOutlined />} iconPosition="start" label="Client & Session Info" />
                <Tab icon={<ShareOutlined />} iconPosition="start" label="Shared Notes" />
                <Tab icon={<LockOutlined />} iconPosition="start" label="Private Notes" />
                <Tab icon={<HistoryOutlined />} iconPosition="start" label="Past Sessions" />
              </Tabs>
            </Box>
            
            <DialogContent dividers>
              {/* Client & Session Info Tab */}
              <TabPanel value={detailsTabValue} index={0}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>Client Information</Typography>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Avatar 
                        sx={{ width: 64, height: 64, bgcolor: '#1976d2' }}
                      >
                        {selectedSession.clientId.fullname.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">{selectedSession.clientId.fullname}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedSession.clientId.email}
                        </Typography>
                        {/* You would need to add these fields to your client model */}
                        {selectedSession.clientId.phone && (
                          <Typography variant="body2" color="text.secondary">
                            {selectedSession.clientId.phone}
                          </Typography>
                        )}
                        {selectedSession.clientId.dateOfBirth && (
                          <Typography variant="body2" color="text.secondary">
                            DOB: {dayjs(selectedSession.clientId.dateOfBirth).format('MMMM D, YYYY')}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Paper>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>Current Session</Typography>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Therapy Type</Typography>
                        <Typography variant="body1">{selectedSession.therapy}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Status</Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: selectedSession.status === 'completed' ? 'success.main' : 
                                  selectedSession.status === 'cancelled' ? 'error.main' : 
                                  'info.main'
                          }}
                        >
                          {selectedSession.status.charAt(0).toUpperCase() + selectedSession.status.slice(1)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Date & Time</Typography>
                        <Typography variant="body1">
                          {dayjs(selectedSession.scheduledTime).format('MMMM D, YYYY h:mm A')}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Duration</Typography>
                        <Typography variant="body1">{selectedSession.duration} minutes</Typography>
                      </Box>
                      {selectedSession.meetingLink && (
                        <Box sx={{ gridColumn: 'span 2' }}>
                          <Typography variant="body2" color="text.secondary">Meeting Link</Typography>
                          <Typography 
                            variant="body1" 
                            component="a" 
                            href={selectedSession.meetingLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            sx={{ color: 'primary.main', textDecoration: 'none' }}
                          >
                            {selectedSession.meetingLink}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </Box>

                {selectedSession.status === 'scheduled' && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      disableElevation
                      onClick={() => handleCompleteSession(selectedSession)}
                      startIcon={<CheckCircleOutline />}
                    >
                      Mark as Completed
                    </Button>
                  </Box>
                )}
              </TabPanel>
              
              {/* Shared Notes Tab */}
              <TabPanel value={detailsTabValue} index={1}>
                <Typography variant="subtitle1" color="text.secondary" paragraph>
                  These notes will be visible to both you and the client. Use this space for session summaries,
                  homework assignments, or any information you want to share with your client.
                </Typography>
                
                <TextField
                  label="Shared Notes"
                  multiline
                  rows={8}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={sharedNotes}
                  onChange={(e) => setSharedNotes(e.target.value)}
                  placeholder="Add shared notes about this session..."
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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
                </Box>
              </TabPanel>
              
              {/* Private Notes Tab */}
              <TabPanel value={detailsTabValue} index={2}>
                <Typography variant="subtitle1" color="text.secondary" paragraph>
                  These notes are private and only visible to you. Use this space for your professional observations,
                  treatment plans, or any confidential information.
                </Typography>
                
                <TextField
                  label="Private Notes"
                  multiline
                  rows={8}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={privateNotes}
                  onChange={(e) => setPrivateNotes(e.target.value)}
                  placeholder="Add private notes about this session..."
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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
                </Box>
              </TabPanel>
              
              {/* Past Sessions Tab */}
              <TabPanel value={detailsTabValue} index={3}>
                <Typography variant="h6" gutterBottom>
                  Past Sessions with {selectedSession.clientId.fullname}
                </Typography>
                
                {loadingPastSessions ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : pastSessions.length === 0 ? (
                  <Typography color="text.secondary">
                    No past sessions found for this client.
                  </Typography>
                ) : (
                  <List sx={{ width: '100%' }}>
                    {pastSessions.map((session) => (
                      <Card key={session._id} sx={{ mb: 2, borderRadius: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {dayjs(session.scheduledTime).format('MMMM D, YYYY')}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                bgcolor: session.status === 'completed' ? '#e8f5e9' : 
                                         session.status === 'cancelled' ? '#ffebee' : '#e3f2fd',
                                color: session.status === 'completed' ? 'success.dark' : 
                                       session.status === 'cancelled' ? 'error.dark' : 'info.dark',
                              }}
                            >
                              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AccessTimeOutlined sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {dayjs(session.scheduledTime).format('h:mm A')} - {session.duration} minutes
                            </Typography>
                          </Box>
                          
                          {session.therapy && (
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Therapy: {session.therapy}
                            </Typography>
                          )}
                          
                          {session.notes?.therapistNotes && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle2" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
                                <LockOutlined sx={{ fontSize: 16, mr: 0.5 }} />
                                Private Notes
                              </Typography>
                              <Typography variant="body2" color="text.secondary" paragraph sx={{ mt: 0.5 }}>
                                {session.notes.therapistNotes}
                              </Typography>
                            </Box>
                          )}
                          
                          {session.notes?.sharedNotes && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle2" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
                                <ShareOutlined sx={{ fontSize: 16, mr: 0.5 }} />
                                Shared Notes
                              </Typography>
                              <Typography variant="body2" color="text.secondary" paragraph sx={{ mt: 0.5 }}>
                                {session.notes.sharedNotes}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </List>
                )}
              </TabPanel>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={handleCloseSessionDetails}>Close</Button>
            </DialogActions>
          </>
        )}
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