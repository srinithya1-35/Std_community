const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

// Utility: generate token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "defaultsecret", {
    expiresIn: "1h",
  });
};

// LOGIN Route
router.post("/login", async (req, res) => {
  const { identifier, password, userType } = req.body;

  if (!identifier || !password || !userType) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    if (userType === "faculty") {
      // Faculty login by email
      const query = "SELECT * FROM admin WHERE email = ?";
      db.query(query, [identifier], async (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }
        if (results.length === 0) {
          return res.status(401).json({ error: "Faculty not found" });
        }

        const faculty = results[0];
        // Compare plain text password since that's how it's stored in DB
        const isMatch = password === faculty.password;
        if (!isMatch) {
          return res.status(401).json({ error: "Incorrect password" });
        }

        const token = generateToken({ id: faculty.admin_id, role: "teacher" });

        res.status(200).json({
          message: "Faculty login successful",
          token,
          user: {
            id: faculty.admin_id,
            name: faculty.name,
            email: faculty.email,
            role: "teacher",
          },
        });
      });
    } else if (userType === "student") {
      // Student login by UUCMS ID
      const query = "SELECT * FROM Student WHERE uucms_id = ?";
      db.query(query, [identifier], async (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }
        if (results.length === 0) {
          return res.status(401).json({ error: "Student not found" });
        }

        const student = results[0];
        // Compare plain text password since that's how it's stored in DB
        const isMatch = password === student.password;
        if (!isMatch) {
          return res.status(401).json({ error: "Incorrect password" });
        }

        const token = generateToken({ id: student.student_id, role: "student" });

        res.status(200).json({
          message: "Student login successful",
          token,
          user: {
            id: student.student_id,
            name: student.name,
            uucms_id: student.uucms_id,
            role: "student",
          },
        });
      });
    } else {
      return res.status(400).json({ error: "Invalid user type" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// STUDENT Signup
router.post("/signup/student", async (req, res) => {
  const { name, uucms_id, password } = req.body;

  if (!name || !uucms_id || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Validate UUCMS ID format
  const uucmsRegex = /^U\d{2}EZ\d{2}S\d{3}\d$/;
  if (!uucmsRegex.test(uucms_id)) {
    return res.status(400).json({ error: "Invalid UUCMS ID format" });
  }

  try {
    // Check if UUCMS ID already exists
    db.query("SELECT * FROM Student WHERE uucms_id = ?", [uucms_id], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (results.length > 0) {
        return res.status(409).json({ error: "UUCMS ID already exists" });
      }

      // Get the next available student_id
      db.query("SELECT MAX(student_id) as maxId FROM Student", async (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        const nextId = (results[0].maxId || 0) + 1;

        // Insert new student
        const insertQuery = "INSERT INTO Student (student_id, name, uucms_id, password) VALUES (?, ?, ?, ?)";
        db.query(insertQuery, [nextId, name, uucms_id, password], (err, result) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Could not register student" });
          }
          console.log("Student registered successfully:", result);
          res.status(201).json({ message: "Student registered successfully" });
        });
      });
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// FACULTY Signup
router.post("/signup/teacher", async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    // Check if email already exists
    db.query("SELECT * FROM admin WHERE email = ?", [email], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (results.length > 0) {
        return res.status(409).json({ error: "Email already exists" });
      }

      // Get the next available admin_id
      db.query("SELECT MAX(admin_id) as maxId FROM admin", async (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        const nextId = (results[0].maxId || 0) + 1;

        // Insert new faculty
        const insertQuery = "INSERT INTO admin (admin_id, name, email, phone, password) VALUES (?, ?, ?, ?, ?)";
        db.query(insertQuery, [nextId, name, email, phone, password], (err, result) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Could not register faculty" });
          }
          console.log("Faculty registered successfully:", result);
          res.status(201).json({ message: "Faculty registered successfully" });
        });
      });
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
