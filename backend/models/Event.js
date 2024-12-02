const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  attendance: [
    {
      participant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        enum: ["present", "absent"],
        default: "absent",
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  documents: [
    {
      url: String,
      name: String,
      type: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  notifications: [
    {
      message: String,
      date: {
        type: Date,
        default: Date.now,
      },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});

module.exports = mongoose.model("Event", eventSchema);
