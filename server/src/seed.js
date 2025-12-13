const mongoose = require("mongoose");
const User = require("./models/user.model"); // Adjust path if needed

mongoose.connect("mongodb://127.0.0.1:27017/hirev", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleUsers = [
  { name: "Aarav Mehta", email: "aarav.mehta1@example.com", phone: "9000000001", cameraType: "dome", coverageArea: "front-gate", loc: [75.7873, 26.9124] },
  { name: "Priya Sharma", email: "priya.sharma2@example.com", phone: "9000000002", cameraType: "bullet", coverageArea: "parking", loc: [75.7960, 26.9230] },
  { name: "Rohan Singh", email: "rohan.singh3@example.com", phone: "9000000003", cameraType: "ptz", coverageArea: "street-facing", loc: [75.8095, 26.9100] },
  { name: "Sneha Gupta", email: "sneha.gupta4@example.com", phone: "9000000004", cameraType: "ip", coverageArea: "inside-premises", loc: [75.8210, 26.9180] },
  { name: "Ankit Verma", email: "ankit.verma5@example.com", phone: "9000000005", cameraType: "analog", coverageArea: "full-coverage", loc: [75.7970, 26.9050] },
  { name: "Pooja Joshi", email: "pooja.joshi6@example.com", phone: "9000000006", cameraType: "other", coverageArea: "corner-view", loc: [75.8100, 26.9150] },
  // More dynamic entries
];

// Utility: random choice
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Existing Jaipur areas (sample wide list)
const areas = [
  { name: "Mansarovar", coord: [75.7805,26.9105] },
  { name: "Vaishali Nagar", coord: [75.7991,26.9235] },
  { name: "Malviya Nagar", coord: [75.8339,26.9126] },
  { name: "Jhotwara", coord: [75.7400,26.9500] },
  { name: "Pratap Nagar", coord: [75.7870,26.9010] },
  { name: "C-Scheme", coord: [75.8231,26.9183] },
  { name: "Civil Lines", coord: [75.8250,26.9190] },
  { name: "Sitapura", coord: [75.8190,26.8420] },
  { name: "Sanganer", coord: [75.7900,26.8310] },
  { name: "Shyam Nagar", coord: [75.8030,26.9130] },
  { name: "Panchyawala", coord: [75.7560,26.9480] },
  { name: "Shipra Path", coord: [75.7850,26.9100] },
  { name: "Sindhi Camp", coord: [75.8060,26.9190] },
  { name: "Kishanpura", coord: [75.8030,26.9000] },
  { name: "Sodala", coord: [75.7784,26.9129] },
  { name: "Ajmer Road", coord: [75.8280,26.9310] },
  { name: "Tonk Road", coord: [75.8180,26.9050] },
  { name: "Kalwar Road", coord: [75.6650,26.9340] },
  { name: "Gopalpura", coord: [75.8070,26.9005] },
  { name: "Bapu Nagar", coord: [75.8055,26.9312] }
];

// Camera and coverage options
const cameraTypes = ["dome", "bullet", "ptz", "ip", "analog", "other", ""];
const coverageAreas = [
  "front-gate","back-gate","parking","street-facing",
  "inside-premises","corner-view","full-coverage",""
];

// Generate 94 more users
for (let i = 7; i <= 100; i++) {
  const area = rand(areas);
  sampleUsers.push({
    name: `User${i} ${["Kumar","Singh","Sharma","Verma","Patel","Mehta"][Math.floor(Math.random()*6)]}`,
    email: `user${i}.${area.name.toLowerCase().replace(/\s+/g,"")}@example.com`,
    phone: `9000000${(100 + i).toString().slice(-7)}`,
    cameraType: rand(cameraTypes),
    coverageArea: rand(coverageAreas),
    loc: area.coord,
  });
}

// Insert into DB
const seedDB = async () => {
  await User.deleteMany({});
  const inserts = sampleUsers.map(u => ({
    name: u.name,
    email: u.email,
    phone: u.phone,
    cameraType: u.cameraType,
    coverageArea: u.coverageArea,
    location: { type: "Point", coordinates: u.loc }
  }));
  await User.insertMany(inserts);
  console.log("Seeded 100 users!");
  mongoose.connection.close();
};

seedDB();
