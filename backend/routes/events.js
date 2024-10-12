const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const Event = require('../models/Event');
const User = require('../models/User');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ deleted: { $ne: true } }).populate('organizer', 'username');
    console.log('Events from database:', events);
    console.log('Number of events:', events.length);
    res.json(events); // Send the events array directly
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new event
router.post('/', auth, roleAuth(['collegeEventer']), async (req, res) => {
  const event = new Event({
    ...req.body,
    organizer: req.user._id
  });

  try {
    const newEvent = await event.save();
    await User.findByIdAndUpdate(req.user._id, { $push: { createdEvents: newEvent._id } });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'username').populate('participants', 'username');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join an event
router.post('/:id/join', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.participants.includes(req.user._id)) {
      return res.status(400).json({ message: 'You have already joined this event' });
    }

    if (event.participants.length >= event.capacity) {
      return res.status(400).json({ message: 'Event is already at full capacity' });
    }

    // Add the user to the participants array
    event.participants.push(req.user._id);
    await event.save();

    // Update the user's participatedEvents
    const user = await User.findById(req.user._id);
    user.participatedEvents.push(event._id);
    await user.save();

    res.status(200).json({ message: 'Successfully joined the event', event });
  } catch (error) {
    console.error('Detailed error in join event:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get participants of an event
router.get('/:id/participants', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('participants', 'username email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if the user is the organizer or a participant
    if (event.organizer.toString() !== req.user._id.toString() && !event.participants.some(p => p._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'You do not have permission to view the participants' });
    }
    
    res.json(event.participants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event participants' });
  }
});

module.exports = router;
