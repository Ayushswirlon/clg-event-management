const mongoose = require('mongoose');
const Event = require('../models/Event');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function deleteAllEvents() {
  try {
    await Event.deleteMany({});
    console.log('All events have been deleted successfully.');
  } catch (error) {
    console.error('Error deleting events:', error);
  } finally {
    mongoose.disconnect();
  }
}

deleteAllEvents();
