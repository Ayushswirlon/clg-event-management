const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js')
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('participatedEvents')
      .populate('createdEvents');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
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

module.exports = router;