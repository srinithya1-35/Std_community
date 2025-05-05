const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

// Combined Login Route for students and all admins
router.post("/login", (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: "Please enter username/email and password." });
  }

  const isEmail = identifier.includes("@");

  if (isEmail) {
    // Login as teacher/admin (email)
    db.query("SELECT * FROM admin WHERE email = ?", [identifier], async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0) return res.status(401).json({ error: "Teacher not found" });

      const admin = results[0];
      const isMatch = await bcrypt.compare(password, admin.password);

      if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

      const token = jwt.sign(
        { adminId: admin.admin_id, role: "teacher" },
        "your_secret_key", // You can move this to .env
        { expiresIn: "1h" }
      );

      res.json({
        message: "Teacher login successful",
        token,
        user: {
          id: admin.admin_id,
          name: admin.name,
          email: admin.email,
          role: "teacher"
        }
      });
    });

  } else {
    // Login as student (UUCMS ID)
    db.query("SELECT * FROM users WHERE uucms_id = ?", [identifier], async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0) return res.status(401).json({ error: "Student not found" });

      const student = results[0];
      const isMatch = await bcrypt.compare(password, student.password);

      if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

      const token = jwt.sign(
        { userId: student.user_id, role: "student" },
        "your_secret_key",
        { expiresIn: "1h" }
      );

      res.json({
        message: "Student login successful",
        token,
        user: {
          id: student.user_id,
          name: student.name,
          uucms_id: student.uucms_id,
          role: "student"
        }
      });
    });
  }
});


// Student Signup Route
router.post("/signup/student", async (req, res) => {
    const { name, uucms_id, password } = req.body;
  
    if (!name || !uucms_id || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    db.query("SELECT * FROM users WHERE uucms_id = ?", [uucms_id], async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length > 0) return res.status(409).json({ error: "UUCMS ID already exists" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      db.query(
        "INSERT INTO users (name, uucms_id, password) VALUES (?, ?, ?)",
        [name, uucms_id, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ error: "Could not create student" });
          res.status(201).json({ message: "Student registered successfully" });
        }
      );
    });
  });
  
  // Teacher Signup Route
  router.post("/signup/teacher", async (req, res) => {
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    db.query("SELECT * FROM admin WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length > 0) return res.status(409).json({ error: "Email already exists" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      db.query(
        "INSERT INTO admin (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ error: "Could not create teacher" });
          res.status(201).json({ message: "Teacher registered successfully" });
        }
      );
    });
  });
  module.exports = router;