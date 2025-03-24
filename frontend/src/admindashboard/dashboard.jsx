import React, { useState } from 'react';
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
  Tooltip
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

// Mock data
const dashboardStats = [
  { title: "Total Users", value: 24580, change: "+12%", icon: <PersonIcon />, color: "#3498db" },
  { title: "Therapists", value: 1245, change: "+8%", icon: <VerifyIcon />, color: "#9b59b6" },
  { title: "Clients", value: 23335, change: "+15%", icon: <PersonIcon />, color: "#2ecc71" },
  { title: "Reported Content", value: 45, change: "+5%", icon: <FlagIcon />, color: "#e74c3c", isNegative: true }
];

const therapistQueue = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    avatar: "/api/placeholder/50/50",
    specialization: "Clinical Psychology",
    documents: ["License.pdf", "Certificate.pdf"],
    status: "Pending"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    avatar: "/api/placeholder/50/50",
    specialization: "Psychiatry",
    documents: ["License.pdf"],
    status: "Pending"
  }
];

const reports = [
  {
    id: 1,
    title: "Inappropriate Content",
    reporter: "John Doe",
    type: "content",
    date: "2025-03-22"
  },
  {
    id: 2,
    title: "Harassment Report",
    reporter: "Jane Smith",
    type: "harassment",
    date: "2025-03-21"
  }
];

function HealNestAdminDashboard() {
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleTherapistClick = (therapist) => {
    setSelectedTherapist(therapist);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const approveTherapist = () => {
    // In a real app, this would call an API to approve the therapist
    console.log(`Approving therapist ${selectedTherapist.id}`);
    handleCloseModal();
  };

  const rejectTherapist = () => {
    // In a real app, this would call an API to reject the therapist
    console.log(`Rejecting therapist ${selectedTherapist.id}`);
    handleCloseModal();
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
          <ListItem button selected sx={{ backgroundColor: '#f5f5f5' }}>
            <ListItemIcon>
              <DashboardIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <VerifyIcon />
            </ListItemIcon>
            <ListItemText primary="Verify Therapists" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <ReportIcon />
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
              Dashboard Overview
            </Typography>
            <IconButton>
              <NotificationsIcon />
            </IconButton>
            <Avatar sx={{ width: 32, height: 32, ml: 1 }} src="/api/placeholder/32/32" />
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            Welcome back, Admin
          </Typography>

          {/* Stats cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {dashboardStats.map((stat, index) => (
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
              <Button color="primary" size="small" endIcon={<ViewListIcon />}>
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
                  {therapistQueue.map((therapist) => (
                    <TableRow key={therapist.id} onClick={() => handleTherapistClick(therapist)} 
                      sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar src={therapist.avatar} sx={{ width: 32, height: 32 }} />
                          <Typography variant="body2">{therapist.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{therapist.specialization}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {therapist.documents.map((doc, idx) => (
                            <Tooltip key={idx} title={doc}>
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
                                {doc.endsWith('.pdf') && '📄'}
                              </Box>
                            </Tooltip>
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={therapist.status} 
                          size="small"
                          sx={{ 
                            bgcolor: therapist.status === 'Pending' ? '#FFF3CD' : '#D1E7DD',
                            color: therapist.status === 'Pending' ? '#856404' : '#155724'
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" color="success">
                            <CheckIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Recent reports */}
          <Paper elevation={0} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Reports</Typography>
              <Button color="primary" size="small" endIcon={<ViewListIcon />}>
                View All
              </Button>
            </Box>
            <List>
              {reports.map((report) => (
                <ListItem
                  key={report.id}
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
                    primary={report.title}
                    secondary={`Reported by: ${report.reporter}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
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
                      src={selectedTherapist.avatar}
                      sx={{ width: 120, height: 120, mb: 2 }}
                    />
                    <Typography variant="h6">{selectedTherapist.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedTherapist.specialization}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" gutterBottom>Status</Typography>
                  <Chip 
                    label={selectedTherapist.status} 
                    sx={{ 
                      bgcolor: selectedTherapist.status === 'Pending' ? '#FFF3CD' : '#D1E7DD',
                      color: selectedTherapist.status === 'Pending' ? '#856404' : '#155724',
                      mb: 2
                    }} 
                  />
                  
                  <Typography variant="subtitle2" gutterBottom>Application Date</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>March 20, 2025</Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>Contact Information</Typography>
                  <Typography variant="body2">example@healNest.com</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>+1 (555) 123-4567</Typography>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>Verification Documents</Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {selectedTherapist.documents.map((doc, idx) => (
                      <Grid item xs={12} sm={6} key={idx}>
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
                                  {doc}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  PDF • 2.4 MB
                                </Typography>
                              </Box>
                            </Box>
                            <Button size="small" variant="outlined" fullWidth>
                              View Document
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  
                  <Typography variant="h6" gutterBottom>Professional Information</Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Education</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>Ph.D in Psychology, Stanford University</Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>M.A. in Clinical Psychology, UCLA</Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Experience</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>10+ years of clinical practice</Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>Published researcher in mental health</Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">Certifications</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>Licensed Clinical Psychologist (LCP #12345)</Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>Certified in Cognitive Behavioral Therapy</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
              <Button variant="outlined" color="error" onClick={rejectTherapist}>
                Reject Application
              </Button>
              <Button variant="contained" color="primary" onClick={approveTherapist}>
                Approve Therapist
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default HealNestAdminDashboard;