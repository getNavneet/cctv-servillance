const router = require("express").Router();
const User = require("../models/user.model");

// Register user
router.post("/register", async (req, res) => {
  try {
    const { name, pincode, locality, lat, lng } = req.body;

    const user = await User.create({
      name,
      pincode,
      locality,
      location: {
        type: "Point",
        coordinates: [lng, lat]
      }
    });

    res.json({ success: true, user });
  } catch (e) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Get all users (with optional filters)
router.get("/", async (req, res) => {
  const { pincode, locality } = req.query;

  const query = {};
  if (pincode) query.pincode = pincode;
  if (locality) query.locality = new RegExp(locality, "i");

  const users = await User.find(query);
  res.json(users);
});

module.exports = router;
