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
  ChatBubbleOutline,
  InsertPhoto,
  Videocam,
  MoreVert,
  Close,
  Send
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useForumStore from '../store/forumStore';
import { useAuthStore } from '../store/authStore';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1DA1F2',
    },
    secondary: {
      main: '#657786',
    },
    background: {
      default: '#E6ECF0',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#14171A',
      secondary: '#657786',
    },
  },
  typography: {
    fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
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
          boxShadow: 'none',
          borderRadius: 16,
          border: '1px solid #E6ECF0',
        },
      },
    },
  },
});

const normalizePost = (post) => ({
  ...post,
  likes: Array.isArray(post.likes) ? post.likes : [],
  comments: Array.isArray(post.comments) ? post.comments : [],
  user: post.user || { name: 'Unknown', role: 'Member' },
  createdAt: post.createdAt || new Date().toISOString()
});

const MindShareFeed = () => {
  const {
    posts = [],
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    addComment,
    likePost
  } = useForumStore();

  const { user } = useAuthStore();

  const [newPostContent, setNewPostContent] = useState('');
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPost, setCurrentPost] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notification, setNotification] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  // Normalize posts data when received
  const normalizedPosts = posts.map(normalizePost);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (error) {
      setNotification({
        open: true,
        message: error,
        severity: 'error'
      });
    }
  }, [error]);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;

    try {
      await createPost({ 
        content: newPostContent, 
        user: user._id 
      });
      setNewPostContent('');
      setNotification({
        open: true,
        message: 'Post shared successfully!',
        severity: 'success'
      });
    } catch (err) {
      setNotification({
        open: true,
        message: 'Failed to share post.',
        severity: 'error'
      });
    }
  };

  const handleEditPost = async () => {
    if (!currentPost || !editContent.trim()) return;

    try {
      await updatePost(currentPost._id, { content: editContent });
      setEditDialogOpen(false);
      setNotification({
        open: true,
        message: 'Post updated successfully!',
        severity: 'success'
      });
    } catch (err) {
      setNotification({
        open: true,
        message: 'Failed to update post.',
        severity: 'error'
      });
    }
  };

  const handleDeletePost = async () => {
    if (!currentPost) return;

    try {
      await deletePost(currentPost._id);
      setDeleteDialogOpen(false);
      setNotification({
        open: true,
        message: 'Post deleted successfully!',
        severity: 'info'
      });
    } catch (err) {
      setNotification({
        open: true,
        message: 'Failed to delete post.',
        severity: 'error'
      });
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentContent.trim()) return;

    try {
      await addComment(postId, { 
        content: commentContent, 
        user: user._id
      });
      setCommentContent('');
      setActiveCommentId(null);
      setNotification({
        open: true,
        message: 'Comment added!',
        severity: 'success'
      });
    } catch (err) {
      setNotification({
        open: true,
        message: 'Failed to add comment.',
        severity: 'error'
      });
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await likePost(postId);
    } catch (err) {
      console.log(err);
      setNotification({
        open: true,
        message: 'Failed to like post.',
        severity: 'error'
      });
    }
  };

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
    setNotification(prev => ({ ...prev, open: false }));
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
          py: 1,
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
            <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>M</Avatar>
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
              MindShare
            </Typography>
          </Box>
          <Box>
            <IconButton size="small">
              <Avatar
                src={user?.avatar || ''}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: { xs: 1, sm: 2 },
          maxWidth: 600,
          mx: 'auto',
          mt: 2
        }}>
          {/* Create Post Card */}
          <Card sx={{ mb: 2, width: '100%' }}>
            <CardContent sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Avatar src={user?.avatar || ''} />
                <TextField
                  fullWidth
                  placeholder="What's happening?"
                  variant="outlined"
                  multiline
                  rows={2}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 4,
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
                  disabled={!newPostContent.trim() || loading}
                  sx={{ px: 3 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Post'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Feed Posts */}
          {loading && normalizedPosts.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : normalizedPosts.length > 0 ? (
            normalizedPosts.map(post => (
              <Card key={post._id} sx={{ mb: 2, width: '100%' }}>
                <CardHeader
                  avatar={
                    <Avatar src={post.user?.avatar || ''} />
                  }
                  action={
                    post.user?._id === user?._id && (
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
                  subheader={new Date(post.createdAt).toLocaleString()}
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
                      {post.likes.length}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {post.comments.length} comments
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
                    startIcon={post.likes.includes(user?._id) ? <Favorite color="error" /> : <FavoriteBorder />}
                    onClick={() => handleLikePost(post._id)}
                    sx={{ 
                      color: post.likes.includes(user?._id) ? 'error.main' : 'text.secondary' 
                    }}
                  >
                    Like
                  </Button>
                  <Button
                    startIcon={<ChatBubbleOutline />}
                    onClick={() => setActiveCommentId(activeCommentId === post._id ? null : post._id)}
                    sx={{ color: 'text.secondary' }}
                  >
                    Comment
                  </Button>
                </Box>

                {/* Comments Section */}
                {(post.comments.length > 0 || activeCommentId === post._id) && (
                  <Box sx={{ bgcolor: 'grey.50', py: 1, px: 2 }}>
                    {/* Existing Comments */}
                    {post.comments.length > 0 && (
                      <List disablePadding>
                        {post.comments.map(comment => (
                          <ListItem
                            key={comment._id}
                            alignItems="flex-start"
                            sx={{ px: 0, pb: 0.5, pt: 1 }}
                          >
                            <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                              <Avatar src={comment.user?.avatar || ''} sx={{ width: 32, height: 32 }} />
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
                                    {comment.user?.name || 'Unknown'}
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
                                  {new Date(comment.createdAt).toLocaleString()}
                                </Typography>
                              </Box>
                            </Box>
                          </ListItem>
                        ))}
                      </List>
                    )}

                    {/* Add Comment */}
                    {activeCommentId === post._id && (
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1,
                        mt: 1
                      }}>
                        <Avatar src={user?.avatar || ''} sx={{ width: 32, height: 32 }} />
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Write a comment..."
                          variant="outlined"
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 4,
                            }
                          }}
                          InputProps={{
                            endAdornment: (
                              <IconButton
                                size="small"
                                color="primary"
                                disabled={!commentContent.trim() || loading}
                                onClick={() => handleAddComment(post._id)}
                              >
                                {loading ? <CircularProgress size={16} /> : <Send fontSize="small" />}
                              </IconButton>
                            )
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </Card>
            ))
          ) : (
            <Typography variant="body1" sx={{ mt: 4, color: 'text.secondary' }}>
              No posts available. Be the first to share something!
            </Typography>
          )}
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
              disabled={!editContent.trim() || loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
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
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
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
      </Box>
    </ThemeProvider>
  );
};

export default MindShareFeed;