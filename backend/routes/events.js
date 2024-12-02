const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleAuth = require("../middleware/roleAuth");
const Event = require("../models/Event");
const User = require("../models/User");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for file uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "event_documents",
    allowed_formats: ["jpg", "jpeg", "png", "pdf", "doc", "docx"],
  },
});

const upload = multer({ storage: storage });

// Get all events
router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = { deleted: { $ne: true } };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "all") {
      query.category = category;
    }

    const events = await Event.find(query).populate("organizer", "username");
    console.log("Events from database:", events);
    console.log("Number of events:", events.length);
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new event
router.post("/", auth, roleAuth(["collegeEventer"]), async (req, res) => {
  try {
    const { title, description, date, location, capacity, category } = req.body;

    console.log("Creating event with user:", req.user._id);

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      capacity,
      category,
      organizer: req.user._id,
    });

    const savedEvent = await newEvent.save();
    console.log("Saved event:", savedEvent);

    // Update the user's createdEvents array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { createdEvents: savedEvent._id },
    });

    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(400).json({ message: error.message });
  }
});

// Get a single event by ID
router.get("/:id", async (req, res) => {
  console.log("Received request for event with ID:", req.params.id);
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizer",
      "username"
    );
    console.log("Found event:", event);
    if (!event) {
      console.log("Event not found");
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res
      .status(500)
      .json({ message: "Error fetching event", error: error.message });
  }
});

// Join an event
router.post("/:id/join", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.participants.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You have already joined this event" });
    }

    if (event.participants.length >= event.capacity) {
      return res
        .status(400)
        .json({ message: "Event is already at full capacity" });
    }

    event.participants.push(req.user._id);
    await event.save();

    const user = await User.findById(req.user._id);
    user.participatedEvents.push(event._id);
    await user.save();

    res.status(200).json({ message: "Successfully joined the event", event });
  } catch (error) {
    console.error("Error joining event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get participants of an event
router.get("/:id/participants", auth, async (req, res) => {
  console.log(
    "Received request for participants of event with ID:",
    req.params.id
  );
  try {
    const event = await Event.findById(req.params.id).populate(
      "participants",
      "username email profilePicture"
    );
    if (!event) {
      console.log("Event not found");
      return res.status(404).json({ message: "Event not found" });
    }
    console.log("Found participants:", event.participants);
    res.json(event.participants);
  } catch (error) {
    console.error("Error fetching event participants:", error);
    res.status(500).json({
      message: "Error fetching event participants",
      error: error.message,
    });
  }
});

// Get events created by the event creator
router.get("/managed", auth, roleAuth(["collegeEventer"]), async (req, res) => {
  try {
    console.log("Fetching managed events for user:", req.user._id);
    console.log("User role:", req.user.role);

    const events = await Event.find({
      organizer: req.user._id,
    })
      .populate("participants", "username email")
      .sort({ date: -1 });

    // Add console.log to debug the response
    console.log("Sending managed events:", events);

    // Ensure we're sending an array
    res.json(events || []);
  } catch (error) {
    console.error("Error in /managed route:", error);
    res.status(500).json({
      message: "Error fetching managed events",
      error: error.message,
    });
  }
});

// Update event attendance
router.post(
  "/:eventId/attendance",
  auth,
  roleAuth(["collegeEventer"]),
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const { attendees } = req.body;

      const event = await Event.findOneAndUpdate(
        { _id: eventId, organizer: req.user._id },
        { $set: { attendance: attendees } },
        { new: true }
      );

      res.json(event);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating attendance", error: error.message });
    }
  }
);

// Share documents for an event
router.post(
  "/:eventId/documents",
  auth,
  roleAuth(["collegeEventer"]),
  upload.array("documents", 5),
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const uploadedFiles = req.files;

      const documentUrls = uploadedFiles.map((file) => ({
        url: file.path,
        name: file.originalname,
        type: file.mimetype,
      }));

      const event = await Event.findOneAndUpdate(
        { _id: eventId, organizer: req.user._id },
        { $push: { documents: { $each: documentUrls } } },
        { new: true }
      );

      res.json(event);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error uploading documents", error: error.message });
    }
  }
);

// Send notification for an event
router.post(
  "/:eventId/notifications",
  auth,
  roleAuth(["collegeEventer"]),
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const { message } = req.body;

      const event = await Event.findOneAndUpdate(
        { _id: eventId, organizer: req.user._id },
        {
          $push: {
            notifications: {
              message,
              date: new Date(),
              sender: req.user._id,
            },
          },
        },
        { new: true }
      );

      res.json(event);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error sending notification", error: error.message });
    }
  }
);

module.exports = router;
