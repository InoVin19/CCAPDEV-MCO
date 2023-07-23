// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const bcrypt = require('bcrypt');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:1234567890@cluster0.ugrgne2.mongodb.net/lab-reservation-system?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Define a schema and model for the user collection
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username:{
    type: String,
    required: true,
    unique: true,
  },
});

const User = mongoose.model('User', userSchema);

// Route to handle user registration
app.post('/register', async (req, res) => {
  const { email, password, username} = req.body;

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // Create a new user in the database
    const newUser = new User({ email, password, username });
    await newUser.save();

    return res.status(201).json({ message: 'Registration successful! You may now log in.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({username});
    if (!user) {
      return res.status(401).json({ error: 'User does not exist.'});
    }

    // Compare the provided password with the hashed password in the database
    if (password === user.password) {
      return res.status(200).json({ message: 'Login successful!' });
    } else {
      return res.status(401).json({ error: 'Password Incorrect.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.get('/fetchUser', async (req, res) => {
  const loggedInUser = req.query.username;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ username: loggedInUser });
    if (!user) {
      return res.status(401).json({ error: 'User does not exist.' });
    }
    
    // Send the user data (excluding the password) to the client
    const userData = {
      username: user.username,
    };
    console.log(user.username)
    return res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.get('/getUsernames', async (req, res) => {
  try {
    const usernames = await User.find({}, 'username'); // Query the database to get all usernames
    return res.status(200).json({ usernames: usernames.map(user => user.username) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));