// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
//const bcrypt = require('bcrypt');

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
  username: {
    type: String,
    required: true,
    unique: true,
  },
  picture: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  socialMedia: {
    facebook: {
      type: String,
      required: false,
    },
    twitter: {
      type: String,
      required: false,
    },
    instagram: {
      type: String,
      required: false,
    },
  },
  reservations: [
    {
      id: {
        type: Number,
        required: true,
      },
      lab: {
        type: String,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
      seat: {
        type: String,
        required: true,
      },
      time: {
        type: [String],
        required: true,
      },
      requestTime: {
        type: String,
        required: true,
      },
    },
  ],
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

app.get('/profiles', async (req, res) => {
  try {
    const allProfiles = await User.find({}); // Retrieve all user profiles, excluding the '_id' field
    return res.status(200).json(allProfiles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
