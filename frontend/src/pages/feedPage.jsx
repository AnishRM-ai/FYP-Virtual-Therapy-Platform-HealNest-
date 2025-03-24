import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardHeader, 
  Avatar, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  Paper, 
  Divider, 
  List, 
  ListItem, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Menu,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  FavoriteBorder, 
  Favorite, 
  BookmarkBorder, 
  Bookmark,
  ChatBubbleOutline, 
  InsertPhoto, 
  Videocam,
  MoreVert,
  Close,
  Send
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a calming theme for mental health app
const theme = createTheme({
  palette: {
    primary: {
      main: '#5271ff',
    },
    secondary: {
      main: '#8e9aaf',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#424242',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.95rem',
    },
    body2: {
      fontSize: '0.85rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
          borderRadius: 12,
        },
      },
    },
  },
});

// Initial sample data for feed posts
const initialPosts = [
  {
    id: 1,
    user: {
      id: 'therapist1',
      name: 'Dr. Sarah Johnson',
      avatar: '/avatar1.jpg',
      role: 'Therapist',
    },
    content: 'Remember, it\'s okay to take breaks and prioritize your mental health. Small steps lead to big changes. 🌿',
    timeAgo: '2h ago',
    likes: 24,
    comments: 8,
    saved: false,
    liked: false,
    commentsList: [
      { 
        id: 1, 
        user: { id: 'user2', name: 'Michael P.', avatar: '/avatar2.jpg' }, 
        content: 'This reminder came at the perfect time. Thank you!', 
        timeAgo: '1h ago' 
      }
    ],
  },
  {
    id: 2,
    user: {
      id: 'user1',
      name: 'Alex Chen',
      avatar: '/avatar3.jpg',
      role: 'Member',
    },
    content: 'Today was tough, but I managed to practice the breathing exercises we discussed in group therapy. They really help!',
    timeAgo: '4h ago',
    likes: 16,
    comments: 5,
    saved: false,
    liked: false,
    commentsList: [
      { 
        id: 1, 
        user: { id: 'therapist1', name: 'Dr. Sarah Johnson', avatar: '/avatar1.jpg' }, 
        content: 'I\'m really proud of you for applying those techniques, Alex! Regular practice makes a big difference.', 
        timeAgo: '3h ago' 
      }
    ],
  },
];

// Sample upcoming sessions data
const upcomingSessions = [
  {
    id: 1,
    title: 'Group Therapy',
    datetime: 'Tomorrow, 2:00 PM',
    hasVideo: true,
  },
  {
    id: 2,
    title: '1:1 Session',
    datetime: 'Jan 15, 2025 • 3:30 PM',
    hasVideo: true,
  },
];

const MindShareFeed = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPost, setCurrentPost] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Current user (in a real app, this would come from authentication)
  const currentUser = {
    id: 'currentUser',
    name: 'Jamie Doe',
    avatar: '/avatar4.jpg',
    role: 'Member',
  };

  // CRUD Operations
  const handleCreatePost = () => {
    if (newPostContent.trim() === '') return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPost = {
        id: Date.now(),
        user: currentUser,
        content: newPostContent,
        timeAgo: 'Just now',
        likes: 0,
        comments: 0,
        saved: false,
        liked: false,
        commentsList: [],
      };
      
      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setIsLoading(false);
      setNotification({
        open: true,
        message: 'Post shared successfully!',
        severity: 'success'
      });
    }, 500);
  };

  const handleEditPost = () => {
    if (!currentPost || editContent.trim() === '') return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedPosts = posts.map(post => 
        post.id === currentPost.id 
          ? { ...post, content: editContent }
          : post
      );
      
      setPosts(updatedPosts);
      setEditDialogOpen(false);
      setIsLoading(false);
      setNotification({
        open: true,
        message: 'Post updated successfully!',
        severity: 'success'
      });
    }, 500);
  };

  const handleDeletePost = () => {
    if (!currentPost) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const filteredPosts = posts.filter(post => post.id !== currentPost.id);
      setPosts(filteredPosts);
      setDeleteDialogOpen(false);
      setIsLoading(false);
      setNotification({
        open: true,
        message: 'Post deleted successfully!',
        severity: 'info'
      });
    }, 500);
  };

  const handleAddComment = (postId) => {
    if (commentContent.trim() === '') return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          const newComment = {
            id: Date.now(),
            user: currentUser,
            content: commentContent,
            timeAgo: 'Just now',
          };
          
          return {
            ...post,
            commentsList: [...post.commentsList, newComment],
            comments: post.comments + 1,
          };
        }
        return post;
      });
      
      setPosts(updatedPosts);
      setCommentContent('');
      setActiveCommentId(null);
      setIsLoading(false);
      setNotification({
        open: true,
        message: 'Comment added!',
        severity: 'success'
      });
    }, 300);
  };

  const toggleLike = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
  };

  const toggleSave = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          saved: !post.saved,
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
  };

  // Handle post menu
  const handleMenuOpen = (event, post) => {
    setAnchorEl(event.currentTarget);
    setCurrentPost(post);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setEditContent(currentPost.content);
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        bgcolor: 'background.default', 
        minHeight: '100vh',
        pb: 4 
      }}>
        {/* App Bar */}
        <Box sx={{ 
          py: 1.5, 
          px: 2, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 24, height: 24, bgcolor: theme.palette.primary.main }}>M</Avatar>
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
              MindShare
            </Typography>
          </Box>
          <Box>
            <IconButton size="small">
              <Avatar 
                src={currentUser.avatar} 
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          px: { xs: 1, sm: 2 },
          gap: 2,
          maxWidth: 1200,
          mx: 'auto',
          mt: 2
        }}>
          {/* Feed Column */}
          <Box sx={{ flex: 1, width: '100%' }}>
            {/* Create Post Card */}
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Avatar src={currentUser.avatar} />
                  <TextField
                    fullWidth
                    placeholder="Share your thoughts..."
                    variant="outlined"
                    multiline
                    rows={2}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      }
                    }}
                  />
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 2
                }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton color="primary" size="small">
                      <InsertPhoto />
                    </IconButton>
                    <IconButton color="primary" size="small">
                      <Videocam />
                    </IconButton>
                  </Box>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleCreatePost}
                    disabled={newPostContent.trim() === '' || isLoading}
                    sx={{ px: 3 }}
                  >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Post'}
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Feed Posts */}
            {posts.map(post => (
              <Card key={post.id} sx={{ mb: 2 }}>
                <CardHeader
                  avatar={
                    <Avatar src={post.user.avatar} />
                  }
                  action={
                    post.user.id === currentUser.id && (
                      <IconButton 
                        size="small"
                        onClick={(e) => handleMenuOpen(e, post)}
                      >
                        <MoreVert />
                      </IconButton>
                    )
                  }
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {post.user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        {post.user.role}
                      </Typography>
                    </Box>
                  }
                  subheader={post.timeAgo}
                />
                <CardContent sx={{ py: 1 }}>
                  <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                    {post.content}
                  </Typography>
                </CardContent>
                
                {/* Interaction Stats */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  px: 2,
                  pb: 1
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {post.likes}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {post.comments} comments
                  </Typography>
                </Box>

                <Divider />
                
                {/* Action Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-around',
                  py: 1
                }}>
                  <Button 
                    startIcon={post.liked ? <Favorite color="error" /> : <FavoriteBorder />}
                    onClick={() => toggleLike(post.id)}
                    sx={{ color: post.liked ? 'error.main' : 'text.secondary' }}
                  >
                    Like
                  </Button>
                  <Button 
                    startIcon={<ChatBubbleOutline />}
                    onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)}
                    sx={{ color: 'text.secondary' }}
                  >
                    Comment
                  </Button>
                  <Button 
                    startIcon={post.saved ? <Bookmark color="primary" /> : <BookmarkBorder />}
                    onClick={() => toggleSave(post.id)}
                    sx={{ color: post.saved ? 'primary.main' : 'text.secondary' }}
                  >
                    Save
                  </Button>
                </Box>
                
                {/* Comments Section */}
                {(post.commentsList.length > 0 || activeCommentId === post.id) && (
                  <Box sx={{ bgcolor: 'grey.50', py: 1, px: 2 }}>
                    {/* Existing Comments */}
                    {post.commentsList.length > 0 && (
                      <List disablePadding>
                        {post.commentsList.map(comment => (
                          <ListItem 
                            key={comment.id} 
                            alignItems="flex-start" 
                            sx={{ px: 0, pb: 0.5, pt: 1 }}
                          >
                            <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                              <Avatar src={comment.user.avatar} sx={{ width: 32, height: 32 }} />
                              <Box sx={{ flex: 1 }}>
                                <Paper 
                                  elevation={0} 
                                  sx={{ 
                                    p: 1.5, 
                                    bgcolor: 'background.paper', 
                                    borderRadius: 2 
                                  }}
                                >
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {comment.user.name}
                                  </Typography>
                                  <Typography variant="body2">
                                    {comment.content}
                                  </Typography>
                                </Paper>
                                <Typography 
                                  variant="caption" 
                                  color="text.secondary" 
                                  sx={{ pl: 1, display: 'block', mt: 0.5 }}
                                >
                                  {comment.timeAgo}
                                </Typography>
                              </Box>
                            </Box>
                          </ListItem>
                        ))}
                      </List>
                    )}
                    
                    {/* Add Comment */}
                    {activeCommentId === post.id && (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: 1, 
                        mt: 1 
                      }}>
                        <Avatar src={currentUser.avatar} sx={{ width: 32, height: 32 }} />
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Write a comment..."
                          variant="outlined"
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                            }
                          }}
                          InputProps={{
                            endAdornment: (
                              <IconButton 
                                size="small" 
                                color="primary"
                                disabled={commentContent.trim() === '' || isLoading}
                                onClick={() => handleAddComment(post.id)}
                              >
                                {isLoading ? <CircularProgress size={16} /> : <Send fontSize="small" />}
                              </IconButton>
                            )
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </Card>
            ))}
          </Box>

          {/* Sidebar */}
          <Box 
            sx={{ 
              width: { xs: '100%', md: 280 },
              flexShrink: 0 
            }}
          >
            <Card>
              <CardHeader 
                title="Upcoming Sessions" 
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent sx={{ pt: 0 }}>
                <List disablePadding>
                  {upcomingSessions.map(session => (
                    <ListItem 
                      key={session.id}
                      disablePadding
                      sx={{ py: 1 }}
                    >
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <Typography variant="subtitle2">
                            {session.title}
                          </Typography>
                          {session.hasVideo && (
                            <Videocam fontSize="small" color="primary" />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {session.datetime}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* Post Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Edit Post
          <IconButton
            size="small"
            onClick={() => setEditDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            multiline
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleEditPost}
            disabled={editContent.trim() === '' || isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this post? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDeletePost}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Post Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>Edit post</MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>Delete post</MenuItem>
      </Menu>

      {/* Notifications */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={4000}
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default MindShareFeed;