const express = require('express');
const db = require('../config/db');
const router = express.Router();

// GET attendance summary for a student
router.get('/summary/:student_id', (req, res) => {
  const student_id = req.params.student_id;
  const sql = `
    SELECT s.subjects_name,
           COUNT(*) AS total_days,
           SUM(a.status = 'Present') AS present_days
    FROM attendance a
    JOIN subjects s ON a.subjects_id = s.subjects_id
    WHERE a.student_id = ?
    GROUP BY a.subjects_id
  `;
  db.query(sql, [student_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST attendance submission
router.post('/submit', async (req, res) => {
  const { subjects_id, date, attendanceData } = req.body;

  if (!subjects_id || !date || !attendanceData || !Array.isArray(attendanceData)) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  const insertSQL = `
    INSERT INTO attendance (student_id, subjects_id, date, status)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE status = VALUES(status)
  `;

  try {
    const insertPromises = attendanceData.map(record => {
      const { student_id, status } = record;
      return new Promise((resolve, reject) => {
        db.query(insertSQL, [student_id, subjects_id, date, status], (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    });

    await Promise.all(insertPromises);

    res.json({ message: 'Attendance recorded successfully.' });
  } catch (error) {
    console.error('Error submitting attendance:', error);
    res.status(500).json({ message: 'Error recording attendance.' });
  }
});

module.exports = router;
