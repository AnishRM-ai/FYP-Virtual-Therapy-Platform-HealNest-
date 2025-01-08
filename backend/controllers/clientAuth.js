const bcrypt = require('bcrypt'); // For hashing passwords
const User = require('../models/userBase');
const Client = require('../models/clientdb');
const Therapist = require('../models/therapistDB');
const Admin = require('../models/admindb');

const registerClient = async (req, res) => {
    const { username, fullname, email, password, oauthProvider, oauthId, role, avatar } = req.body;

    try {
        // Check if the email already exists
        const existingClient = await Client.findOne({ email });
        if (existingClient) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        // Check if the username already exists
        const existingUsername = await Client.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username is already taken.' });
        }

        // Hash password for non-OAuth users
        let hashedPassword = null;
        if (!oauthProvider) {
            if (!password) {
                return res.status(400).json({ message: 'Password is required for non-OAuth users.' });
            }
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Create new client
        const newClient = new Client({
            username,
            fullname,
            email,
            password: hashedPassword, // Null for OAuth users
            oauthProvider: oauthProvider || null,
            oauthId: oauthId || null,
            role: 'client', // Force role to 'client' for security
            avatar: avatar || 'default-avatar-url.png', // Set a default avatar
        });

        // Save the client to the database
        await newClient.save();

        // Exclude password from the response
        const clientResponse = {
            username: newClient.username,
            fullname: newClient.fullname,
            email: newClient.email,
            avatar: newClient.avatar,
            role: newClient.role,
            createdAt: newClient.createdAt,
        };

        res.status(201).json({ message: 'Registration successful!', client: clientResponse });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred during registration.' });
    }
};


//controller for logging in.
const login = async(req, res, next) => {
    const {email, password, role} = req.body;
    
    //check if the all the required information is provided.
    if(!email || !password || !role){
        return res.status(400).json({message:"Please provide all the required informations"});
    }

    try{
        let user;
        //Identify the role of users from corresponding collections.
        if(role == "client"){
            user = await Client.findOne({email}).select("+password");
        } else if( role == "therapist") {
            user = await Therapist.findOne({ email }).select("+password");
        } else if ( role == "admin") {
            user = await Admin.findOne({ email }).select("+password");
        } else {
            return res.status(400).json({ message: "Invalid role provided."});
        }

        //Check if the user exist.
        if(!user) {
            return res.status(404).json({ message: "User not found."});
        }

        //Verify Password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials."});
        }

        //userid and role for token middleware
        req.body.userId = user._id;
        req.body.role = user.role;

        next();


    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Server error. Please try again later." });
    }



}

module.exports = { registerClient,
                login
};
