const router = require("express").Router();
const User = require("../models/user.model");

// Register user
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, lat, lng, cameraType, coverageArea } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: "Name is required" 
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: "Email is required" 
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: "Phone number is required" 
      });
    }

    if (!lat || !lng) {
      return res.status(400).json({ 
        success: false, 
        error: "Location coordinates are required" 
      });
    }

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid coordinates" 
      });
    }

    // Optional: Check for duplicate email
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: "This email is already registered" 
      });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      cameraType: cameraType || "",
      coverageArea: coverageArea || "",
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)] // [lng, lat] for GeoJSON
      }
    });

    res.json({ 
      success: true, 
      message: "Camera registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        cameraType: user.cameraType,
        coverageArea: user.coverageArea,
        createdAt: user.createdAt
      }
    });

  } catch (e) {
    console.error("Registration error:", e);
    
    // Handle mongoose validation errors
    if (e.name === "ValidationError") {
      return res.status(400).json({ 
        success: false, 
        error: "Validation failed: " + Object.values(e.errors).map(err => err.message).join(", ")
      });
    }

    res.status(500).json({ 
      success: false, 
      error: "Something went wrong. Please try again." 
    });
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
    
    if (data.error) {
      return res.status(404).json({
        success: false,
        message: "Location not found"
      });
    }

    const a = data.address || {};

    // Flatten the response to match frontend expectations
    res.json({
      success: true,
      pincode: a.postcode || "",
      city: a.city || a.town || "",
      state: a.state || "",
      locality: a.suburb || a.village || a.neighbourhood || "",
      // Optionally include full details if needed
      coordinates: {
        lat: Number(lat),
        lng: Number(lng)
      },
      formattedAddress: data.display_name || ""
    });

  } catch (err) {
    console.error(err);
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
