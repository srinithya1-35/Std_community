const express = require('express');
const db = require('../config/db');
const router = express.Router();

// GET attendance analysis for all subjects and students
router.get('/analysis/all', (req, res) => {
  const sql = `
    SELECT 
      st.student_id,
      st.name,
      st.uucms_id,
      sb.subjects_name,
      COUNT(a.attendance_id) AS total_classes,
      SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_count
    FROM Attendance a
    JOIN Student st ON a.student_id = st.student_id
    JOIN Subjects sb ON a.subjects_id = sb.subjects_id
    GROUP BY st.student_id, sb.subjects_id
    ORDER BY sb.subjects_name, st.name
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching attendance analysis:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(results);
  });
});

// GET attendance analysis for a specific student
router.get('/analysis/student/:student_id', (req, res) => {
  const studentId = req.params.student_id;

  const sql = `
    SELECT 
      st.student_id,
      st.name,
      st.uucms_id,
      sb.subjects_name,
      COUNT(a.attendance_id) AS total_classes,
      SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_count
    FROM Attendance a
    JOIN Student st ON a.student_id = st.student_id
    JOIN Subjects sb ON a.subjects_id = sb.subjects_id
    WHERE st.student_id = ?
    GROUP BY sb.subjects_id
    ORDER BY sb.subjects_name
  `;

  db.query(sql, [studentId], (err, results) => {
    if (err) {
      console.error("Error fetching attendance:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
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
    INSERT INTO Attendance (student_id, subjects_id, date, status)
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
