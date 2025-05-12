const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");
const authRoutes = require("./routes/auth");
const attendanceRoutes = require('./routes/attendance');
const studentRoutes = require('./routes/students');
const subjectRoutes = require('./routes/subjects');
const testRoutes = require('./routes/test');
const path = require('path');
const socialRoutes = require('./routes/social');
const announcementRoutes = require('./routes/announcement');

// Add dotenv configuration
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/auth", authRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/students', studentRoutes); 
app.use('/subjects', subjectRoutes);
app.use('/api/announcement', announcementRoutes);

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

app.use('/api/social', socialRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Students endpoint: http://localhost:5000/students");
  console.log("Test endpoint: http://localhost:5000/api/test");
});
