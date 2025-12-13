const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  pincode: String,
  locality: String,
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

userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);
