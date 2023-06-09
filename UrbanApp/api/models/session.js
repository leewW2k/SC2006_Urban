const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  id: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  timing: {
    type: Number,
    required: true,
  },
  coordinates: {
    type: [
      {
        latitude: Number,
        longitude: Number,
      },
    ],
    required: true,
  },
  isCycle: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
});

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
