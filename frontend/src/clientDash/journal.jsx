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
  Grid,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  Alert,
  InputAdornment,
  Chip,
  Fade
} from '@mui/material';
import {
  DeleteOutlined,
  EditOutlined,
  AccessTimeOutlined,
  CloseOutlined,
  AddOutlined,
  SearchOutlined,
  BookmarkBorderOutlined
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Layout from './layout';

const drawerWidth = 240;

export default function JournalManagement() {
  const navigate = useNavigate();
  const { journalId } = useParams();
  const [selectedTab, setSelectedTab] = useState('Journal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Journal states
  const [journals, setJournals] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [journalTitle, setJournalTitle] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [isNewJournal, setIsNewJournal] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  // Mock user data
  const user = {
    fullname: 'John Doe',
    email: 'john@example.com',
    role: 'client'
  };

  // Get random pastel color for journal cards
  const getRandomColor = (id) => {
    const colors = [
      { bg: '#f6e5f5', accent: '#9c51b6' },
      { bg: '#e5f1f5', accent: '#4d91a5' },
      { bg: '#f5efe5', accent: '#bc8a5f' },
      { bg: '#e5f5e7', accent: '#5b9a63' },
      { bg: '#f5e5e5', accent: '#a55d5d' }
    ];
    return colors[parseInt(id, 10) % colors.length];
  };

  // Extract excerpt from content
  const getExcerpt = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + '...';
  };

  // Mock fetch journals
  useEffect(() => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      const mockJournals = [
        {
          _id: '1',
          date: new Date('2025-03-15'),
          title: 'Finding Peace',
          content: 'Today I practiced mindfulness for 20 minutes. I noticed my thoughts were less chaotic than usual. The guided meditation helped me focus on my breathing and stay present. I felt a sense of calm that lasted throughout the morning. I want to continue this practice daily.',
          tags: ['mindfulness', 'meditation']
        },
        {
          _id: '2',
          date: new Date('2025-03-10'),
          title: 'Overcoming Anxiety',
          content: 'I used the breathing techniques my therapist taught me when I felt anxious during the meeting. I counted four counts in, held for seven, and exhaled for eight. It was subtle enough that no one noticed, but effective enough that I could continue without my heart racing. Im proud of myself for implementing this strategy in a real-world situation.',
          tags: ['anxiety', 'coping skills']
        },
        {
          _id: '3',
          date: new Date('2025-03-05'),
          title: 'Gratitude Practice',
          content: 'I am grateful for my family, my health, and the opportunity to grow. These small things bring me joy. When I focus on gratitude, my perspective shifts. Problems seem smaller and blessings seem greater. Today I spent five minutes writing down specific things I m thankful for, and it improved my mood significantly.',
          tags: ['gratitude', 'positivity']
        },
        {
          _id: '4',
          date: new Date('2025-02-28'),
          title: 'Creative Expression',
          content: 'I spent an hour drawing today without any judgment or expectations. It felt liberating to create without pressure. The colors and shapes flowed naturally, and I lost track of time. This kind of creative expression seems to be therapeutic for me.',
          tags: ['creativity', 'art therapy']
        }
      ];
      setJournals(mockJournals);
      setLoading(false);

      // If journalId is provided in URL, open the edit dialog for that journal
      if (journalId) {
        const journal = mockJournals.find(j => j._id === journalId);
        if (journal) {
          setSelectedJournal(journal);
          setJournalTitle(journal.title);
          setJournalContent(journal.content);
          setIsNewJournal(false);
          setOpenEditDialog(true);
        }
      }
    }, 1000);
  }, [journalId]);

  // Handle creating a new journal
  const handleCreateJournal = () => {
    setIsNewJournal(true);
    setJournalTitle('');
    setJournalContent('');
    setOpenCreateDialog(true);
  };

  const handleSaveNewJournal = () => {
    const newJournal = {
      _id: `${journals.length + 1}`,
      date: new Date(),
      title: journalTitle,
      content: journalContent,
      tags: ['new entry']
    };
    setJournals([newJournal, ...journals]);
    setAlertMessage('Your thoughts have been saved');
    setAlertSeverity('success');
    setAlertOpen(true);
    setOpenCreateDialog(false);
  };

  // Handle editing journal
  const handleEdit = (journal) => {
    setSelectedJournal(journal);
    setJournalTitle(journal.title);
    setJournalContent(journal.content);
    setIsNewJournal(false);
    navigate(`/journal/${journal._id}`, { replace: true });
    setOpenEditDialog(true);
  };

  const handleCloseEdit = () => {
    navigate('/journal', { replace: true });
    setOpenEditDialog(false);
  };

  const handleSaveEdit = () => {
    setJournals(prevJournals => 
      prevJournals.map(journal => 
        journal._id === selectedJournal._id 
          ? { ...journal, title: journalTitle, content: journalContent } 
          : journal
      )
    );
    setAlertMessage('Journal updated successfully');
    setAlertSeverity('success');
    setAlertOpen(true);
    navigate('/journal', { replace: true });
    setOpenEditDialog(false);
  };

  // Handle deleting a journal
  const handleDelete = (journal) => {
    setSelectedJournal(journal);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    setJournals(prevJournals => prevJournals.filter(journal => journal._id !== selectedJournal._id));
    setAlertMessage('Entry removed from your journal');
    setAlertSeverity('success');
    setAlertOpen(true);
    setOpenDeleteDialog(false);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  // Filter journals based on search term
  const filteredJournals = journals.filter(journal => 
    journal.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    journal.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout
      drawerWidth={drawerWidth}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
      user={user}
    >
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
            My Journal
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Reflect, remember, and grow through your personal journey
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={handleCreateJournal}
          disableElevation
          sx={{
            bgcolor: '#6c68a3',
            color: 'white',
            borderRadius: 3,
            px: 3,
            py: 1.2,
            '&:hover': {
              bgcolor: '#56528a',
            }
          }}
        >
          New Entry
        </Button>
      </Box>

      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden', 
          mb: 4,
          border: '1px solid #e0e0e0',
          p: 1
        }}
      >
        <TextField
          placeholder="Search by title, content, or tags..."
          variant="outlined"
          fullWidth
          size="medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined sx={{ color: '#6c68a3' }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 3,
              bgcolor: '#f8f8fb'
            }
          }}
        />
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <CircularProgress sx={{ color: '#6c68a3' }} />
        </Box>
      ) : error ? (
        <Box sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : filteredJournals.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            p: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f8f8fb',
            border: '1px dashed #c8c7db'
          }}
        >
          <BookmarkBorderOutlined sx={{ fontSize: 60, color: '#c8c7db', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {searchTerm ? "No matching entries found" : "Your journal is empty"}
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 500, mb: 3 }}>
            {searchTerm 
              ? "Try a different search term or browse all your entries" 
              : "Start documenting your thoughts, feelings, and experiences. Each entry is a step in your journey."}
          </Typography>
          {searchTerm ? (
            <Button 
              variant="outlined" 
              onClick={() => setSearchTerm('')}
              sx={{ 
                borderRadius: 3,
                color: '#6c68a3',
                borderColor: '#6c68a3'
              }}
            >
              Clear Search
            </Button>
          ) : (
            <Button 
              variant="outlined" 
              startIcon={<AddOutlined />}
              onClick={handleCreateJournal}
              sx={{ 
                borderRadius: 3,
                color: '#6c68a3',
                borderColor: '#6c68a3'
              }}
            >
              Write Your First Entry
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredJournals.map((journal) => {
            const colorScheme = getRandomColor(journal._id);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={journal._id}>
                <Fade in={true} timeout={300}>
                  <Card 
                    elevation={0} 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 3,
                      border: '1px solid #e0e0e0',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
                      }
                    }}
                  >
                    <Box sx={{ 
                      height: 8, 
                      bgcolor: colorScheme.accent 
                    }} />
                    <CardContent sx={{ 
                      flexGrow: 1, 
                      display: 'flex', 
                      flexDirection: 'column',
                      bgcolor: colorScheme.bg,
                      px: 3,
                      pt: 3
                    }}>
                      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeOutlined sx={{ fontSize: 16, color: colorScheme.accent }} />
                        <Typography variant="body2" color="text.secondary">
                          {dayjs(journal.date).format('MMMM D, YYYY')}
                        </Typography>
                      </Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
                        {journal.title}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        mb: 2, 
                        flexGrow: 1,
                        color: '#555',
                        lineHeight: 1.6
                      }}>
                        {getExcerpt(journal.content)}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto' }}>
                        {journal.tags.map((tag, idx) => (
                          <Chip 
                            key={idx} 
                            label={tag} 
                            size="small" 
                            sx={{ 
                              bgcolor: colorScheme.accent + '20',
                              color: colorScheme.accent,
                              borderRadius: 1,
                              '& .MuiChip-label': {
                                px: 1
                              }
                            }} 
                          />
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions sx={{ 
                      justifyContent: 'flex-end', 
                      px: 2, 
                      py: 1.5,
                      borderTop: '1px solid #eee'
                    }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEdit(journal)}
                        sx={{ color: '#6c68a3' }}
                      >
                        <EditOutlined fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDelete(journal)}
                        sx={{ color: '#d25f5f' }}
                      >
                        <DeleteOutlined fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Fade>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Create Journal Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Create New Journal Entry
            <IconButton aria-label="close" onClick={() => setOpenCreateDialog(false)}>
              <CloseOutlined />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            variant="outlined"
            value={journalTitle}
            onChange={(e) => setJournalTitle(e.target.value)}
            placeholder="Give your entry a title..."
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
          <TextField
            label="Your thoughts"
            multiline
            rows={12}
            fullWidth
            margin="normal"
            variant="outlined"
            value={journalContent}
            onChange={(e) => setJournalContent(e.target.value)}
            placeholder="Express your thoughts, feelings, and experiences freely..."
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={() => setOpenCreateDialog(false)}
            sx={{ 
              borderRadius: 2,
              color: '#666'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveNewJournal}
            variant="contained"
            disableElevation
            disabled={!journalTitle.trim() || !journalContent.trim()}
            sx={{
              bgcolor: '#6c68a3',
              color: 'white',
              borderRadius: 2,
              px: 3,
              '&:hover': {
                bgcolor: '#56528a',
              },
              '&.Mui-disabled': {
                bgcolor: '#e0e0e0'
              }
            }}
          >
            Save Entry
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Journal Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEdit} fullWidth maxWidth="md">
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Edit Journal Entry
            <IconButton aria-label="close" onClick={handleCloseEdit}>
              <CloseOutlined />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            variant="outlined"
            value={journalTitle}
            onChange={(e) => setJournalTitle(e.target.value)}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
          <TextField
            label="Content"
            multiline
            rows={12}
            fullWidth
            margin="normal"
            variant="outlined"
            value={journalContent}
            onChange={(e) => setJournalContent(e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={handleCloseEdit}
            sx={{ 
              borderRadius: 2,
              color: '#666'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            disableElevation
            disabled={!journalTitle.trim() || !journalContent.trim()}
            sx={{
              bgcolor: '#6c68a3',
              color: 'white',
              borderRadius: 2,
              px: 3,
              '&:hover': {
                bgcolor: '#56528a',
              },
              '&.Mui-disabled': {
                bgcolor: '#e0e0e0'
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Typography variant="h6">Delete Journal Entry</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedJournal?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            sx={{ 
              borderRadius: 2,
              color: '#666'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            variant="contained"
            disableElevation
            sx={{
              bgcolor: '#d25f5f',
              color: 'white',
              borderRadius: 2,
              '&:hover': {
                bgcolor: '#b95353',
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar 
        open={alertOpen} 
        autoHideDuration={4000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alertSeverity} 
          sx={{ 
            width: '100%',
            borderRadius: 2
          }}
          variant="filled"
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Layout>
  );
}