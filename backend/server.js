require('dotenv').config();
const express = require('express');
const connectDB = require('../backend/connection/connection');
const authRoutes = require('../backend/routes/authenticationRoutes');


const app = express();
connectDB();// Connect to Database.
const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.json({ message: "Lets do it!"});
})
app.use(express.json()); // To Parse incoming requests with JSON payloads.
//API gateway for authentication.
app.use('/api/auth', authRoutes);

//Listen to the PORT.
app.listen( PORT || 3000, ()=> {
    console.log(`Your server is running on Port ${PORT}`);
})