const mongoose = require('mongoose');
const Event = require('../models/Event');
const User = require('../models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const sampleEvents = [
  {
    title: 'Annual Science Fair',
    description: 'Showcase your scientific projects and innovations',
    date: new Date('2023-09-15T10:00:00'),
    location: 'Main Campus Auditorium',
    capacity: 200,
    category: 'academic'
  },
  {
    title: 'Spring Music Festival',
    description: 'A night of live music performances by student bands',
    date: new Date('2023-05-20T18:00:00'),
    location: 'University Amphitheater',
    capacity: 500,
    category: 'social'
  },
  {
    title: 'Intramural Basketball Tournament',
    description: 'Compete in our annual basketball tournament',
    date: new Date('2023-11-05T09:00:00'),
    location: 'University Sports Complex',
    capacity: 100,
    category: 'sports'
  }
];

async function createSampleEvents() {
  try {
    // Find a collegeEventer user to be the organizer
    const organizer = await User.findOne({ role: 'collegeEventer' });

    if (!organizer) {
      console.error('No collegeEventer user found. Please create one first.');
      return;
    }

    for (const eventData of sampleEvents) {
      const newEvent = new Event({
        ...eventData,
        organizer: organizer._id
      });
      await newEvent.save();
      console.log(`Created event: ${newEvent.title}`);
    }

    console.log('Sample events have been created successfully.');
  } catch (error) {
    console.error('Error creating sample events:', error);
  } finally {
    mongoose.disconnect();
  }
}

createSampleEvents();
