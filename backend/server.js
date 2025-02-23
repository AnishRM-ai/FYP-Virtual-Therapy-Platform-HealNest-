require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const googleOAuthConfig = require('./config/googleOAuth');
const cors = require('cors');
const connectDB = require('./connection/connection');
const authRoutes = require('./routes/authenticationRoutes');
const cookieParser = require('cookie-parser');

const app = express();
connectDB();

const PORT = process.env.PORT || 5555;

app.use(
  session({
      secret: process.env.SESSION_SECRET || 'your_secret_key',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }, // Set to `true` in production with HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); 
app.use(cookieParser());

app.get('/', (req, res) => {
    res.json({ message: "Server is running!" });
});

// Google OAuth login route
app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback route
app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
       

        if(!req.user) {
          return res.redirect('/login');
        }

        console.log("Received state", req.query.state);
      
        // Redirect based on user role
        if (req.user.role === 'client') {
            res.redirect('http://localhost:5173/client-dashboard');
        } else if (req.user.role === 'therapist') {
            res.redirect('/therapist-dashboard');
        } else {
            res.redirect('/select-role');
        }
    }
);

// API Gateway for authentication
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});
