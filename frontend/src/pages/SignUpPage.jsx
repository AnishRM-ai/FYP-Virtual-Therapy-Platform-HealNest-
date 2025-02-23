import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Divider, Container, Grid } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Alert from '@mui/material/Alert';
import toast from 'react-hot-toast';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signup, error } = useAuthStore();

  useEffect(() => {
    const stateParam = searchParams.get("state");
    if (stateParam) {
      try {
        const decodedState = JSON.parse(decodeURIComponent(stateParam));
        const role = decodedState.role;
        setFormData((prevData) => ({ ...prevData, role }));
      } catch (error) {
        console.error("Error decoding state:", error);
      }
    }
  }, [searchParams, navigate]);

  const validate = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.fullname) newErrors.fullname = 'Full name is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await signup(formData.email, formData.password, formData.username, formData.fullname, formData.role);
        navigate("/verify-email");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Grid container spacing={2} alignItems="center">
        {/* Left Side - Benefits Section */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', p: 4, background: 'linear-gradient(to right, #a8e6cf, #dcedc1)', borderRadius: 3 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome to Virtual Therapy
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, maxWidth: '80%' }}>
            Discover a new way to take care of your mental health. Our platform provides you with:
          </Typography>
          <ul style={{ textAlign: 'left', maxWidth: '80%' }}>
            <li><Typography variant="body1">✔ Professional, certified therapists</Typography></li>
            <li><Typography variant="body1">✔ Secure and private sessions</Typography></li>
            <li><Typography variant="body1">✔ Flexible scheduling</Typography></li>
            <li><Typography variant="body1">✔ Affordable pricing</Typography></li>
            <li><Typography variant="body1">✔ 24/7 access to resources</Typography></li>
          </ul>
        </Grid>

        {/* Right Side - Signup Form */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: '100%',
              maxWidth: 400,
              px: 3,
              py: 4,
              backgroundColor: 'white',
              borderRadius: 3,
              boxShadow: 3,
              textAlign: 'center',
              mx: 'auto',
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Create Your Account
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
              Welcome! Fill in the details to get started.
            </Typography>

            <Divider sx={{ my: 2 }}></Divider>
            {error && (
              <Alert severity="error" sx={{ width: "100%", maxWidth: 400 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Full name" variant="outlined" margin="normal" name="fullname" value={formData.fullname} onChange={handleChange} error={!!errors.fullname} helperText={errors.fullname} />
              <TextField fullWidth label="Username" variant="outlined" margin="normal" name="username" value={formData.username} onChange={handleChange} error={!!errors.username} helperText={errors.username} />
              <TextField fullWidth label="Email address" variant="outlined" margin="normal" type="email" name="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} />
              <TextField fullWidth label="Password" variant="outlined" margin="normal" type="password" name="password" value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} />

              <Button fullWidth variant="contained" type="submit" sx={{ mt: 2, py: 1.5, backgroundColor: '#34495E', borderRadius: 5, ':hover': { backgroundColor: '#7756c6' } }}>
                Signup
              </Button>
            </form>

            <Divider sx={{ my: 2 }}></Divider>
            <Typography variant="body2" color="textSecondary" mt={2}>
              Already have an account?{' '}
              <Typography component="span" color="primary" onClick={() => navigate("/signin")} sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
                Sign in
              </Typography>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
