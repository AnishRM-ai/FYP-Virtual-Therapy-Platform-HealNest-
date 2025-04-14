import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Chip,
  Tooltip,
  TextField,
  Alert,
  CircularProgress, Menu, MenuItem, FormControl, InputLabel, Select, FormHelperText
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  VerifiedUser as VerifyIcon,
  Report as ReportIcon,
  People as PeopleIcon,
  ArrowUpward as ArrowUpwardIcon,
  Person as PersonIcon,
  Flag as FlagIcon,
  ViewList as ViewListIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  MoreVert as MoreVertIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

// Import our admin store
import useAdminStore from '../store/adminStore';

function HealNestAdminDashboard() {
  // Local state
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportAction, setReportAction] = useState('Resolved');
  const [reportNotes, setReportNotes] = useState('');
  const [reportMenuAnchor, setReportMenuAnchor] = useState(null);
  const [activeReportId, setActiveReportId] = useState(null);
  
  // Access the admin store
  const { 
    pendingTherapists, 
    reports,
    filteredReports,
    dashboardStats,
    isLoading, 
    error,
    clearError,
    fetchPendingTherapists, 
    verifyTherapist,
    fetchAllReports,
    fetchDashboardStats, handleReport
  } = useAdminStore();

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardStats();
    fetchPendingTherapists();
    fetchAllReports();
  }, []);

  const handleTherapistClick = (therapist) => {
    setSelectedTherapist(therapist);
    setModalOpen(true);
    setFeedbackText('');
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const approveTherapist = async () => {
    if (selectedTherapist) {
      const result = await verifyTherapist(
        selectedTherapist._id, // Use _id from API data
        true, // isApproved = true
      );
      
      if (result.success) {
        // Refresh dashboard stats after approval
        fetchDashboardStats();
        handleCloseModal();
      }
    }
  };

  const rejectTherapist = async () => {
    if (selectedTherapist) {
      const result = await verifyTherapist(
        selectedTherapist._id, // Use _id from API data
        false, // isApproved = false
        feedbackText
      );
      
      if (result.success) {
        // Refresh dashboard stats after rejection
        fetchDashboardStats();
        handleCloseModal();
      }
    }
  };

  // Add these new handler functions
  const handleReportMenuClick = (event, reportId) => {
    event.stopPropagation();
    setReportMenuAnchor(event.currentTarget);
    setActiveReportId(reportId);
  };

  const handleReportMenuClose = () => {
    setReportMenuAnchor(null);
    setActiveReportId(null);
  };

  const handleOpenReportModal = (report) => {
    setSelectedReport(report);
    setReportModalOpen(true);
    setReportAction('Resolved'); // Default action
    setReportNotes('');
    handleReportMenuClose();
  };

  const handleCloseReportModal = () => {
    setReportModalOpen(false);
    setSelectedReport(null);
  };

  const submitReportAction = async () => {
    if (selectedReport) {
      const result = await handleReport(
        selectedReport._id,
        reportAction,
        reportNotes
      );
      
      if (result.success) {
        // Refresh data after handling report
        fetchAllReports();
        fetchDashboardStats();
        handleCloseReportModal();
      }
    }
  };

  // Helper function to map API stats to UI format
  const formatDashboardStats = () => {
    const stats = [
      { 
        title: "Total Users", 
        value: dashboardStats.totalUsers || 0, 
        change: "+12%", 
        icon: <PersonIcon />, 
        color: "#3498db" 
      },
      { 
        title: "Therapists", 
        value: dashboardStats.totalTherapists || 0, 
        change: "+8%", 
        icon: <VerifyIcon />, 
        color: "#9b59b6" 
      },
      { 
        title: "Pending Therapists", 
        value: dashboardStats.pendingTherapists || 0, 
        change: "+3%", 
        icon: <PersonIcon />, 
        color: "#2ecc71" 
      },
      { 
        title: "Pending Reports", 
        value: dashboardStats.pendingReports || 0, 
        change: "+5%", 
        icon: <FlagIcon />, 
        color: "#e74c3c", 
        isNegative: true 
      }
    ];
    
    return stats;
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Fetch appropriate data based on tab
    if (tab === 'verifyTherapists') {
      fetchPendingTherapists();
    } else if (tab === 'reports') {
      fetchAllReports();
    } else if (tab === 'dashboard') {
      fetchDashboardStats();
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component="div"
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#3f51b5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              H
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            HealNest Admin
          </Typography>
        </Box>
        <Divider />
        <List>
          <ListItem 
            button 
            selected={activeTab === 'dashboard'}
            onClick={() => handleTabChange('dashboard')}
            sx={{ backgroundColor: activeTab === 'dashboard' ? '#f5f5f5' : 'transparent' }}
          >
            <ListItemIcon>
              <DashboardIcon color={activeTab === 'dashboard' ? "primary" : "inherit"} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem 
            button
            selected={activeTab === 'verifyTherapists'}
            onClick={() => handleTabChange('verifyTherapists')}
            sx={{ backgroundColor: activeTab === 'verifyTherapists' ? '#f5f5f5' : 'transparent' }}
          >
            <ListItemIcon>
              <VerifyIcon color={activeTab === 'verifyTherapists' ? "primary" : "inherit"} />
            </ListItemIcon>
            <ListItemText primary="Verify Therapists" />
          </ListItem>
          <ListItem 
            button
            selected={activeTab === 'reports'}
            onClick={() => handleTabChange('reports')}
            sx={{ backgroundColor: activeTab === 'reports' ? '#f5f5f5' : 'transparent' }}
          >
            <ListItemIcon>
              <ReportIcon color={activeTab === 'reports' ? "primary" : "inherit"} />
            </ListItemIcon>
            <ListItemText primary="Reported Content" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="User Management" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'verifyTherapists' && 'Therapist Verification'}
              {activeTab === 'reports' && 'Report Management'}
            </Typography>
            <IconButton>
              <NotificationsIcon />
            </IconButton>
            <Avatar sx={{ width: 32, height: 32, ml: 1 }} src="/api/placeholder/32/32" />
          </Toolbar>
        </AppBar>

        {/* Error message display */}
        {error && (
          <Alert 
            severity="error" 
            onClose={clearError}
            sx={{ m: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {activeTab === 'dashboard' && (
          <Box sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 3 }}>
              Welcome back, Admin
            </Typography>

            {/* Stats cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {formatDashboardStats().map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card elevation={0}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: `${stat.color}20`,
                            color: stat.color
                          }}
                        >
                          {stat.icon}
                        </Box>
                        <Chip
                          size="small"
                          icon={<ArrowUpwardIcon fontSize="small" />}
                          label={stat.change}
                          color={stat.isNegative ? "error" : "success"}
                          sx={{ 
                            height: '24px',
                            '& .MuiChip-icon': { 
                              color: 'inherit',
                              transform: stat.isNegative ? 'rotate(180deg)' : 'none'
                            }
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stat.value.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Therapist verification queue */}
            <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Therapist Verification Queue</Typography>
                <Button 
                  color="primary" 
                  size="small" 
                  endIcon={<ViewListIcon />}
                  onClick={() => handleTabChange('verifyTherapists')}
                >
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Specialization</TableCell>
                      <TableCell>Documents</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingTherapists.slice(0, 2).map((therapist) => (
                      <TableRow key={therapist._id} onClick={() => handleTherapistClick(therapist)} 
                        sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar src={therapist.profileImage || "/api/placeholder/32/32"} sx={{ width: 32, height: 32 }} />
                            <Typography variant="body2">{therapist.fullName || `${therapist.fullname}`}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{therapist.specializations || 'Not specified'}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {(therapist.qualification || []).map((doc, idx) => (
                              <Tooltip key={idx} title={doc.name || 'Document'}>
                                <Box
                                  component="span"
                                  sx={{
                                    p: 0.5,
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 1,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  📄
                                </Box>
                              </Tooltip>
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={therapist.verificationStatus || 'Pending'} 
                            size="small"
                            sx={{ 
                              bgcolor: '#FFF3CD',
                              color: '#856404'
                            }} 
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTherapistClick(therapist);
                              }}
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTherapistClick(therapist);
                              }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                    {pendingTherapists.length === 0 && !isLoading && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">No pending therapists</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Recent reports */}
            <Paper elevation={0} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Recent Reports</Typography>
                <Button 
                  color="primary" 
                  size="small" 
                  endIcon={<ViewListIcon />}
                  onClick={() => handleTabChange('reports')}
                >
                  View All
                </Button>
              </Box>
              <List>
                {reports.slice(0, 2).map((report) => (
                  <ListItem
                    key={report._id}
                    secondaryAction={
                      <IconButton edge="end">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    sx={{ px: 2, borderRadius: 1, mb: 1, '&:hover': { backgroundColor: '#f5f5f5' } }}
                  >
                    <ListItemIcon>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#ffecec',
                          color: '#e74c3c'
                        }}
                      >
                        <FlagIcon fontSize="small" />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={report.title || report.reason}
                      secondary={`Reported by: ${report.reportedBy?.username || 'Anonymous'}`}
                    />
                  </ListItem>
                ))}
                {reports.length === 0 && !isLoading && (
                  <ListItem>
                    <ListItemText primary="No recent reports" />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Box>
        )}

        {activeTab === 'verifyTherapists' && (
          <Box sx={{ p: 3 }}>
            <Paper elevation={0} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Therapists Awaiting Verification</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Specialization</TableCell>
                      <TableCell>Applied On</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingTherapists.map((therapist) => (
                      <TableRow key={therapist._id} onClick={() => handleTherapistClick(therapist)} 
                        sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar src={therapist.avatar || "/api/placeholder/32/32"} sx={{ width: 32, height: 32 }} />
                            <Typography variant="body2">{therapist.fullName || `${therapist.fullname}`}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{therapist.email}</TableCell>
                        <TableCell>{therapist.specializations || 'Not specified'}</TableCell>
                        <TableCell>
                          {new Date(therapist.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={therapist.verificationStatus || 'Pending'} 
                            size="small"
                            sx={{ 
                              bgcolor: '#FFF3CD',
                              color: '#856404'
                            }} 
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTherapistClick(therapist);
                              }}
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTherapistClick(therapist);
                              }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                    {pendingTherapists.length === 0 && !isLoading && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">No pending therapists</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}

{activeTab === 'reports' && (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Reports Management</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Reported By</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Reported On</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow 
                  key={report._id}
                  sx={{ '&:hover': { backgroundColor: '#f5f5f5' }, cursor: 'pointer' }}
                  onClick={() => handleOpenReportModal(report)}
                >
                  <TableCell>{report.title || report.reason}</TableCell>
                  <TableCell>{report.reportedBy?.username || 'Anonymous'}</TableCell>
                  <TableCell>{report.type || 'General'}</TableCell>
                  <TableCell>
                    {new Date(report.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={report.status || 'Pending'} 
                      size="small"
                      sx={{ 
                        bgcolor: report.status === 'Resolved' ? '#D1E7DD' : '#FFF3CD',
                        color: report.status === 'Resolved' ? '#155724' : '#856404'
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small"
                      onClick={(e) => handleReportMenuClick(e, report._id)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {reports.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={6} align="center">No reports found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Report action menu */}
      <Menu
        anchorEl={reportMenuAnchor}
        open={Boolean(reportMenuAnchor)}
        onClose={handleReportMenuClose}
      >
        <MenuItem onClick={() => {
          const report = reports.find(r => r._id === activeReportId);
          if (report) handleOpenReportModal(report);
        }}>
          View Details
        </MenuItem>
        <MenuItem onClick={() => {
          const report = reports.find(r => r._id === activeReportId);
          if (report) {
            setSelectedReport(report);
            setReportAction('Resolved');
            setReportNotes('No issues found.');
            setReportModalOpen(true);
          }
          handleReportMenuClose();
        }}>
          Mark as Resolved
        </MenuItem>
        <MenuItem onClick={() => {
          const report = reports.find(r => r._id === activeReportId);
          if (report) {
            setSelectedReport(report);
            setReportAction('Rejected');
            setReportNotes('Report was rejected after review.');
            setReportModalOpen(true);
          }
          handleReportMenuClose();
        }}>
          Reject Report
        </MenuItem>
      </Menu>
    </Box>
  )}

  {/* Add this new dialog for report handling */}
  <Dialog
    open={reportModalOpen}
    onClose={handleCloseReportModal}
    maxWidth="md"
    fullWidth
  >
    {selectedReport && (
      <>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Report Action</Typography>
            <IconButton onClick={handleCloseReportModal}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>{selectedReport.title || selectedReport.reason}</Typography>
              <Chip 
                label={selectedReport.status || 'Pending'} 
                sx={{ 
                  bgcolor: selectedReport.status === 'Resolved' ? '#D1E7DD' : '#FFF3CD',
                  color: selectedReport.status === 'Resolved' ? '#155724' : '#856404',
                  mb: 2
                }} 
              />
              
              <Typography variant="subtitle2" gutterBottom>Reported On</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {new Date(selectedReport.createdAt).toLocaleDateString()}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>Reported By</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {selectedReport.reportedBy?.username || 'Anonymous User'}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>Report Type</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {selectedReport.type || 'General Report'}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>Report Details</Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="body2">
                  {selectedReport.description || selectedReport.reason || 'No detailed description provided.'}
                </Typography>
              </Paper>
              
              <Typography variant="h6" gutterBottom>Take Action</Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="report-action-label">Action</InputLabel>
                <Select
                  labelId="report-action-label"
                  value={reportAction}
                  label="Action"
                  onChange={(e) => setReportAction(e.target.value)}
                >
                  <MenuItem value="resolved">Mark as Resolved</MenuItem>
                  <MenuItem value="reviewing">Set to Under Review</MenuItem>
                  <MenuItem value="dismissed">Reject Report</MenuItem>
                </Select>
                <FormHelperText>Select the action to take on this report</FormHelperText>
              </FormControl>
              
              <Typography variant="subtitle2" gutterBottom>Admin Notes</Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Add notes about how this report was handled..."
                value={reportNotes}
                onChange={(e) => setReportNotes(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            onClick={handleCloseReportModal}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={submitReportAction}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Submit Action'}
          </Button>
        </DialogActions>
      </>
    )}
  </Dialog>
      </Box>

      {/* Therapist details modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        {selectedTherapist && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Therapist Verification</Typography>
                <IconButton onClick={handleCloseModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      src={selectedTherapist.profileImage || "/api/placeholder/120/120"}
                      sx={{ width: 120, height: 120, mb: 2 }}
                    />
                    <Typography variant="h6">
                      {selectedTherapist.fullName || `${selectedTherapist.fullname}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedTherapist.specializations || 'Not specified'}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" gutterBottom>Status</Typography>
                  <Chip 
                    label={selectedTherapist.verificationStatus || 'Pending'} 
                    sx={{ 
                      bgcolor: '#FFF3CD',
                      color: '#856404',
                      mb: 2
                    }} 
                  />
                  
                  <Typography variant="subtitle2" gutterBottom>Application Date</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {new Date(selectedTherapist.createdAt).toLocaleDateString()}
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>Contact Information</Typography>
                  <Typography variant="body2">{selectedTherapist.email}</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>{selectedTherapist.phone || 'No phone provided'}</Typography>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>Verification Documents</Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                  {selectedTherapist.qualificationProof.resume && (
      <Grid item xs={12} sm={6}>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '4px',
                  bgcolor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}
              >
                📄
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Resume
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  PDF • Document
                </Typography>
              </Box>
            </Box>
            <Button 
              size="small" 
              variant="outlined" 
              fullWidth
              href={`/${selectedTherapist.qualificationProof.resume}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Resume
            </Button>
          </CardContent>
        </Card>
      </Grid>
    )}
                  
                    {(!selectedTherapist.documents || selectedTherapist.documents.length === 0) && (
                      <Grid item xs={12}>
                        <Alert severity="info">No documents uploaded</Alert>
                      </Grid>
                    )}
                  </Grid>
                  
                  <Typography variant="h6" gutterBottom>Professional Information</Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Education</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {selectedTherapist.education.degree || 'Not provided'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Experience</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {selectedTherapist.yearsOfExperience ? `${selectedTherapist.yearsOfExperience} years` : 'Not provided'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">Certifications</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {selectedTherapist.certifications || 'Not provided'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>Feedback</Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        placeholder="Add feedback for the therapist here..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={rejectTherapist}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Reject Application'}
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={approveTherapist}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Approve Therapist'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default HealNestAdminDashboard;