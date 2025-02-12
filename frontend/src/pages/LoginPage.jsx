import * as React from 'react';
import { useState } from 'react';
import { Box, TextField, Button, Typography, Divider, Container, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


export default function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = useState('');

  const { error, login} = useAuthStore(); // Assuming you want to call login from your store
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);
    try{
      await login(email, password);
      toast.success('Successfully logged in.')
      
    } catch (error) {
      console.log(error);
    }
    
   
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5555/auth/google';
  };

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          px: 3,
          py: 4,
          backgroundColor: 'white',
          borderRadius: 10,
          boxShadow: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Login
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Welcome Back!
        </Typography>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          sx={{
            mb: 2,
            textTransform: 'none',
            color: 'text.primary',
            borderColor: 'text.secondary',
            borderRadius: 10,
          }}
        >
          Continue with Google
        </Button>

        <Divider sx={{ my: 2 }}>or</Divider>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Input Fields */}
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          name="email"
          value={email}
          onChange={handleChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
        />

        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          margin="normal"
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
        />

        <Typography variant="body2" color="primary" sx={{ textAlign: 'right', mb: 2, textDecoration:"underline", cursor:"pointer"}} onClick={() => navigate("/forgotpassword")}>
          Forgot password?
        </Typography>

        <Button
          fullWidth
          variant="contained"
          type='submit'
          sx={{
            mt: 2,
            py: 1.5,
            backgroundColor: '#34495E',
            borderRadius: 5,
            ':hover': { backgroundColor: '#7756c6' },
          }}
          onClick={handleSubmit}
        >
          Sign In
        </Button>

        <Divider sx={{ my: 2 }}>or</Divider>
        <Typography variant="body2" color="textSecondary" mt={2}>
          Don't have an account?{' '}
          <Typography
            component="span"
            color="primary"
            onClick={() => navigate("/signup")}
            sx={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            Sign up
          </Typography>
        </Typography>
      </Box>
    </Container>
  );
}
