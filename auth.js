// backend/routes/auth.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

// Utility function: generate JWT
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "83f85539299d414ad7894c59f47ec5a1c6aaeef0e5f555dbcb9bb8102e06b75aeaf77851480d4f3006d7154cac5c29c16b8e4c2b208bb5cc1ad68b66ee5a1fdb", {
    expiresIn: "1h",
  });
};

// LOGIN Route: for both students (uucms_id) and teachers (email)
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: "Please enter UUCMS ID/email and password." });
  }

  const isEmail = identifier.includes("@");

  try {
    if (isEmail) {
      // Teacher/Admin Login
      db.query("SELECT * FROM admin WHERE email = ?", [identifier], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(401).json({ error: "Teacher not found" });

        const teacher = results[0];
        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

        const token = generateToken({ id: teacher.admin_id, role: "teacher" });

        res.status(200).json({
          message: "Teacher login successful",
          token,
          user: {
            id: teacher.admin_id,
            name: teacher.name,
            email: teacher.email,
            role: "teacher",
          },
        });
      });

    } else {
      // Student Login
      db.query("SELECT * FROM Student WHERE uucms_id = ?", [identifier], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(401).json({ error: "Student not found" });

        const student = results[0];
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

        const token = generateToken({ id: student.user_id, role: "student" });

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
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Student Signup
router.post("/signup/student", async (req, res) => {
  const { name, uucms_id, password } = req.body;

  if (!name || !uucms_id || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    db.query("SELECT * FROM Student WHERE uucms_id = ?", [uucms_id], async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length > 0) return res.status(409).json({ error: "UUCMS ID already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (name, uucms_id, password) VALUES (?, ?, ?)",
        [name, uucms_id, hashedPassword],
        (err) => {
          if (err) return res.status(500).json({ error: "Could not register student" });
          res.status(201).json({ message: "Student registered successfully" });
        }
      );
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Teacher/Admin Signup
router.post("/signup/teacher", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    db.query("SELECT * FROM admin WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length > 0) return res.status(409).json({ error: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO admin (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err) => {
          if (err) return res.status(500).json({ error: "Could not register teacher" });
          res.status(201).json({ message: "Teacher registered successfully" });
        }
      );
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
