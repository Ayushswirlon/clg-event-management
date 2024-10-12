const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '' },
  role: { type: String, enum: ['user', 'collegeEventer'], default: 'user' },
  participatedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  createdEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);