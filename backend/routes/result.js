const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/db'); // your database connection

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/results'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// Admin uploads a result PDF
router.post('/upload', upload.single('file'), (req, res) => {
  const { title, student_id, uploaded_by } = req.body;
  const file_path = `/uploads/results/${req.file.filename}`;
  
  db.query(
    'INSERT INTO Results (title, file_path, uploaded_by, student_id) VALUES (?, ?, ?, ?)',
    [title, file_path, uploaded_by, student_id || null],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Result uploaded successfully' });
    }
  );
});

// Student views their results
router.get('/student/:student_id', (req, res) => {
  const { student_id } = req.params;
  db.query(
    `SELECT * FROM Results WHERE student_id IS NULL OR student_id = ? ORDER BY uploaded_at DESC`,
    [student_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

module.exports = router;
