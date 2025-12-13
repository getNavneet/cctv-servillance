require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user.model");

const users = [
  {
    name: "Jaipur User",
    pincode: "302001",
    locality: "Pink City",
    location: { type: "Point", coordinates: [75.7873, 26.9124] }
  },
  {
    name: "Jodhpur User",
    pincode: "342001",
    locality: "Ratanada",
    location: { type: "Point", coordinates: [73.0243, 26.2389] }
  },
  {
    name: "Udaipur User",
    pincode: "313001",
    locality: "Lake City",
    location: { type: "Point", coordinates: [73.7125, 24.5854] }
  },
  {
    name: "Kota User",
    pincode: "324001",
    locality: "Gumanpura",
    location: { type: "Point", coordinates: [75.8648, 25.2138] }
  },
  {
    name: "Bikaner User",
    pincode: "334001",
    locality: "Junagarh Fort",
    location: { type: "Point", coordinates: [73.3119, 28.0229] }
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany(); // remove old test data
  await User.insertMany(users);
  console.log("Sample Rajasthan users inserted");
  process.exit();
}

seed();
