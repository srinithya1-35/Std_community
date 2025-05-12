const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/db');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Create a new post
router.post('/posts', auth, upload.single('media'), async (req, res) => {
    try {
        const { content, media_type } = req.body;
        const media_url = req.file ? req.file.path : null;
        
        const query = 'INSERT INTO posts (user_id, content, media_url, media_type) VALUES (?, ?, ?, ?)';
        db.query(query, [req.user.id, content, media_url, media_type], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Post created successfully', postId: result.insertId });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all posts
router.get('/posts', auth, async (req, res) => {
    try {
        const query = `
            SELECT p.*, u.username, u.profile_picture 
            FROM posts p 
            JOIN users u ON p.user_id = u.id 
            ORDER BY p.created_at DESC
        `;
        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Follow a user
router.post('/follow/:userId', auth, async (req, res) => {
    try {
        const query = 'INSERT INTO followers (follower_id, following_id) VALUES (?, ?)';
        db.query(query, [req.user.id, req.params.userId], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Followed successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send a message
router.post('/messages', auth, upload.single('media'), async (req, res) => {
    try {
        const { receiver_id, content } = req.body;
        const media_url = req.file ? req.file.path : null;
        
        const query = 'INSERT INTO messages (sender_id, receiver_id, content, media_url) VALUES (?, ?, ?, ?)';
        db.query(query, [req.user.id, receiver_id, content, media_url], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Message sent successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get messages between two users
router.get('/messages/:userId', auth, async (req, res) => {
    try {
        const query = `
            SELECT m.*, u.username, u.profile_picture 
            FROM messages m 
            JOIN users u ON m.sender_id = u.id 
            WHERE (m.sender_id = ? AND m.receiver_id = ?) 
            OR (m.sender_id = ? AND m.receiver_id = ?)
            ORDER BY m.created_at ASC
        `;
        db.query(query, [req.user.id, req.params.userId, req.params.userId, req.user.id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Share notes
router.post('/notes', auth, upload.single('file'), async (req, res) => {
    try {
        const { title, content, subject } = req.body;
        const file_url = req.file ? req.file.path : null;
        
        const query = 'INSERT INTO notes (user_id, title, content, file_url, subject) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [req.user.id, title, content, file_url, subject], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Note shared successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all notes
router.get('/notes', auth, async (req, res) => {
    try {
        const query = `
            SELECT n.*, u.username, u.profile_picture 
            FROM notes n 
            JOIN users u ON n.user_id = u.id 
            ORDER BY n.created_at DESC
        `;
        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 