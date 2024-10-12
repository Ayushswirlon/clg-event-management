const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: ['clg-event-management-uofw-ptw0ru66h-ayush-carpetners-projects.vercel.app', 'https://clg-event-management.vercel.app/'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
  res.send('EventHub API is running');
});

// Instead, export the app
module.exports = app;
