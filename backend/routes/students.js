const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all students
router.get('/', (req, res) => {
  db.query('SELECT * FROM Student', (err, results) => {
    if (err) {
      console.error('Error fetching students:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get single student by ID
router.get('/:id', (req, res) => {
  db.query(
    'SELECT `student_id` as id, name, uucms_id FROM Student WHERE `student_id` = ?',
    [req.params.id],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
      res.json(results[0]);
    }
  );
});

module.exports = router;
