const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");
const authRoutes = require("./routes/auth");
const attendanceRoutes = require('./routes/attendance');
const studentRoutes = require('./routes/students');
const subjectRoutes = require('./routes/subjects');
const testRoutes = require('./routes/test');

// Add dotenv configuration
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/students', studentRoutes); 
app.use('/subjects', subjectRoutes);

// Logging middleware for /test route
app.use('/test', (req, res, next) => {
  console.log('→ /test route called');
  next();
});

// Test routes
app.use('/test', testRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: "API is working!" });
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
    console.log("Students endpoint: http://localhost:5000/students");
    console.log("Test endpoint: http://localhost:5000/api/test");
});
