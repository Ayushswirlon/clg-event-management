const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const Event = require('../models/Event');
const User = require('../models/User');

// Get all events
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = { deleted: { $ne: true } };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    const events = await Event.find(query).populate('organizer', 'username');
    console.log('Events from database:', events);
    console.log('Number of events:', events.length);
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new event
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, date, location, capacity, category } = req.body;
    console.log('Creating event with data:', { title, description, date, location, capacity, category });
    console.log('User ID:', req.user._id);

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      capacity,
      category,
      organizer: req.user._id
    });
    const savedEvent = await newEvent.save();
    console.log('Event saved:', savedEvent);

    // Add the event to the user's createdEvents array
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { createdEvents: savedEvent._id } },
      { new: true }
    );
    console.log('Updated user:', updatedUser);

    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get a single event by ID
router.get('/:id', async (req, res) => {
  console.log('Received request for event with ID:', req.params.id);
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'username');
    console.log('Found event:', event);
    if (!event) {
      console.log('Event not found');
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Error fetching event', error: error.message });
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

    event.participants.push(req.user._id);
    await event.save();

    const user = await User.findById(req.user._id);
    user.participatedEvents.push(event._id);
    await user.save();

    res.status(200).json({ message: 'Successfully joined the event', event });
  } catch (error) {
    console.error('Error joining event:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get participants of an event
router.get('/:id/participants', auth, async (req, res) => {
  console.log('Received request for participants of event with ID:', req.params.id);
  try {
    const event = await Event.findById(req.params.id).populate('participants', 'username email profilePicture');
    if (!event) {
      console.log('Event not found');
      return res.status(404).json({ message: 'Event not found' });
    }
    console.log('Found participants:', event.participants);
    res.json(event.participants);
  } catch (error) {
    console.error('Error fetching event participants:', error);
    res.status(500).json({ message: 'Error fetching event participants', error: error.message });
  }
});

module.exports = router;
