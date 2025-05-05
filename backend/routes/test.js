const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.get('/test-db', (req, res) => {
  const sql = 'SELECT * FROM Student LIMIT 5'; // Replace 'students' with any existing table name

  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Failed to fetch data" });
    }
    console.log("DB fetched:", results);
    res.json(results);
  });
});

module.exports = router;
