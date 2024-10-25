const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js')
const auth = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_pictures',
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Make sure these routes are defined
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }

    // Ensure role is either 'user' or 'collegeEventer'
    const validRole = ['user', 'collegeEventer'].includes(role) ? role : 'user';

    const user = new User({ username, email, password, role: validRole });
    await user.save();
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.status(201).send({ user, token });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      // Duplicate key error
      res.status(400).json({ message: 'Username or email already exists' });
    } else {
      res.status(400).json({ message: 'Error creating user', error: error.message });
    }
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
    }
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Add this route to the existing routes in auth.js
router.get('/profile', auth, async (req, res) => {
  try {
    console.log('Fetching profile for user ID:', req.user._id);
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('participatedEvents')
      .populate('createdEvents')
      .lean();
    
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Ensure these fields exist, even if they're empty
    user.participatedEvents = user.participatedEvents || [];
    user.createdEvents = user.createdEvents || [];
    
    console.log('User found:', user);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});

// New route to get participants of an event
router.get('/event-participants/:eventId', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate('participants', 'username email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event.participants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event participants' });
  }
});

// Make sure this route is defined in your auth.js file
router.put('/profile', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['username', 'email', 'bio'];
    const isValidOperation = Object.keys(updates).every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }

    // If a new profile picture was uploaded, add its URL to the updates
    if (req.file) {
      updates.profilePicture = req.file.path;
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).send();
    }

    Object.keys(updates).forEach(update => user[update] = updates[update]);
    await user.save();

    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
