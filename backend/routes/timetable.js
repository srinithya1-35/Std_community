const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/db');

// Setup file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/timetable/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

// Upload timetable (Admin)
router.post('/upload', upload.single('pdf'), (req, res) => {
  const { title } = req.body;
  const filename = req.file.filename;

  db.query(
    'INSERT INTO timetable (title, filename) VALUES (?, ?)',
    [title, filename],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(200).json({ message: 'Timetable uploaded successfully.' });
    }
  );
});

// Get latest timetable (Student)
router.get('/latest', (req, res) => {
  db.query(
    'SELECT * FROM timetable ORDER BY uploaded_at DESC LIMIT 1',
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.length === 0) return res.status(404).json({ message: 'No timetable found' });

      res.json({ timetable: result[0] });
    }
  );
});

module.exports = router;
