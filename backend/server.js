const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
require("./models/User");
require("./models/Event");

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173", // or whatever port your frontend is running on
    credentials: true,
  })
);
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established"))
  .catch((error) => console.log("MongoDB connection error:", error));

// Make sure this line is present and correct
app.use("/api/auth", authRoutes);

app.use("/api/events", eventRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
