const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Get all subjects
router.get('/', (req, res) => {
  db.query('SELECT * FROM Subjects', (err, results) => {
    if (err) {
      console.error('Error fetching subjects:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Add a new subject
router.post('/add', (req, res) => {
  const { subjects_name } = req.body;

  if (!subjects_name) {
    return res.status(400).json({ error: 'Subject name is required' });
  }

  const sql = 'INSERT INTO subjects (subjects_name) VALUES (?)';
  db.query(sql, [subjects_name], (err, result) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ error: 'Insert failed' });
    }
    res.json({ message: 'Subject added', subjects_id: result.insertId });
  });
});

module.exports = router;
