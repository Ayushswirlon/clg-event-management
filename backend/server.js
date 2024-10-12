const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173', // or whatever port your frontend is running on
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connection established'))
.catch((error) => console.log('MongoDB connection error:', error));

// Make sure this line is present and correct
app.use('/api/auth', require('./routes/auth'));

app.use('/api/events', require('./routes/events'));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});