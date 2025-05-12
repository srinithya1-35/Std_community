const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../config/db');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/calendar/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Upload academic calendar (admin)
router.post('/upload', upload.single('calendar'), (req, res) => {
  const filePath = req.file.path;
  const title = req.body.title;

  db.query(
    'INSERT INTO Academic_Calendar (title, file_path) VALUES (?, ?)',
    [title, filePath],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error uploading calendar');
      }
      res.status(200).send('Calendar uploaded successfully');
    }
  );
});

// Get latest academic calendar (student)
router.get('/latest', (req, res) => {
  db.query(
    'SELECT * FROM Academic_Calendar ORDER BY uploaded_at DESC LIMIT 1',
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error fetching calendar');
      }
      res.json(result[0]);
    }
  );
});

module.exports = router;
