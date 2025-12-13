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

router.get("/reverse", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({
      success: false,
      message: "lat and lng are required"
    });
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: {
          "User-Agent": "mern-location-prototype"
        }
      }
    );

    const data = await response.json();
    const a = data.address || {};

    res.json({
      success: true,
      data: {
        coordinates: {
          lat: Number(lat),
          lng: Number(lng)
        },
        address: {
          house: a.house_number || "",
          road: a.road || "",
          locality: a.suburb || a.village || "",
          subDistrict: a.county || "",
          district: a.state_district || "",
          city: a.city || a.town || "",
          state: a.state || "",
          pincode: a.postcode || "",
          country: a.country || ""
        },
        formattedAddress: data.display_name || ""
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Reverse geocoding failed"
    });
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
