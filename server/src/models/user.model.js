const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  cameraType: {
    type: String,
    enum: ["dome", "bullet", "ptz", "ip", "analog", "other", ""],
    default: ""
  },
  coverageArea: {
    type: String,
    enum: [
      "front-gate",
      "back-gate",
      "parking",
      "street-facing",
      "inside-premises",
      "corner-view",
      "full-coverage",
      ""
    ],
    default: ""
  },
  location: {
    type: {
      type: String,
      default: "Point"
    },
    coordinates: [Number] // [lng, lat]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create geospatial index for location-based queries
userSchema.index({ location: "2dsphere" });

// Optional: Index for faster email lookups
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
