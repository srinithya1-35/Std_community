const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create upload folder if it doesn't exist
const resultsUploadPath = path.join(__dirname, 'uploads/results');
if (!fs.existsSync(resultsUploadPath)) {
    fs.mkdirSync(resultsUploadPath, { recursive: true });
}

// Serve static frontend files (React build)
app.use(express.static(path.join(__dirname, "..", "frontend", "dist"))); // or "build"

// Serve uploaded files (results, calendar, timetable)
app.use('/uploads/results', express.static(resultsUploadPath));
app.use('/uploads/calendar', express.static('uploads/calendar'));
app.use('/uploads/timetable', express.static('uploads/timetable'));

// Routes
const db = require("./config/db");
const authRoutes = require("./routes/auth");
const attendanceRoutes = require("./routes/attendance");
const studentRoutes = require("./routes/students");
const subjectRoutes = require("./routes/subjects");
const resultRoutes = require("./routes/result");
const calendarRoutes = require("./routes/calendar");
const timetableRoutes = require("./routes/timetable");

app.use("/auth", authRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/students", studentRoutes);
app.use("/subjects", subjectRoutes);
app.use("/results", resultRoutes);
app.use("/calendar", calendarRoutes);
app.use("/timetable", timetableRoutes);

// Health check endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Fallback for undefined routes
app.use((req, res) => {
  res.status(404).send("404: Page Not Found");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📁 Frontend: http://localhost:${PORT}/index.html`);
});

