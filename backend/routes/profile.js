// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Update user profile
router.put('/profile', auth, async (req, res) => {
  const { username, bio, profilePicture } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, bio, profilePicture },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
