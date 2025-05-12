const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type!'));
  }
});

// Create a new post
router.post('/posts', upload.single('media'), async (req, res) => {
  const { content, user_id, user_type } = req.body;
  const media_url = req.file ? `/uploads/${req.file.filename}` : null;
  const media_type = req.file ? getMediaType(req.file.mimetype) : null;

  const query = `
    INSERT INTO Posts (user_id, user_type, content, media_url, media_type)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [user_id, user_type, content, media_url, media_type], (err, result) => {
    if (err) {
      console.error('Error creating post:', err);
      return res.status(500).json({ error: 'Failed to create post' });
    }
    res.status(201).json({ message: 'Post created successfully', post_id: result.insertId });
  });
});

// Get all posts (with pagination)
router.get('/posts', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const query = `
    SELECT p.*, 
           CASE 
             WHEN p.user_type = 'student' THEN s.name 
             ELSE a.name 
           END as user_name,
           COUNT(DISTINCT l.like_id) as likes_count,
           COUNT(DISTINCT c.comment_id) as comments_count
    FROM Posts p
    LEFT JOIN Student s ON p.user_id = s.student_id AND p.user_type = 'student'
    LEFT JOIN admin a ON p.user_id = a.admin_id AND p.user_type = 'faculty'
    LEFT JOIN Likes l ON p.post_id = l.post_id
    LEFT JOIN Comments c ON p.post_id = c.post_id
    GROUP BY p.post_id
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `;

  db.query(query, [limit, offset], (err, results) => {
    if (err) {
      console.error('Error fetching posts:', err);
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }
    res.json(results);
  });
});

// Add a comment
router.post('/comments', async (req, res) => {
  const { post_id, user_id, user_type, content } = req.body;

  const query = `
    INSERT INTO Comments (post_id, user_id, user_type, content)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [post_id, user_id, user_type, content], (err, result) => {
    if (err) {
      console.error('Error adding comment:', err);
      return res.status(500).json({ error: 'Failed to add comment' });
    }
    res.status(201).json({ message: 'Comment added successfully', comment_id: result.insertId });
  });
});

// Toggle like on a post
router.post('/likes/toggle', async (req, res) => {
  const { post_id, user_id, user_type } = req.body;

  const checkQuery = 'SELECT * FROM Likes WHERE post_id = ? AND user_id = ? AND user_type = ?';
  
  db.query(checkQuery, [post_id, user_id, user_type], (err, results) => {
    if (err) {
      console.error('Error checking like:', err);
      return res.status(500).json({ error: 'Failed to process like' });
    }

    if (results.length > 0) {
      // Unlike
      const deleteQuery = 'DELETE FROM Likes WHERE post_id = ? AND user_id = ? AND user_type = ?';
      db.query(deleteQuery, [post_id, user_id, user_type], (err) => {
        if (err) {
          console.error('Error removing like:', err);
          return res.status(500).json({ error: 'Failed to unlike post' });
        }
        res.json({ message: 'Post unliked successfully' });
      });
    } else {
      // Like
      const insertQuery = 'INSERT INTO Likes (post_id, user_id, user_type) VALUES (?, ?, ?)';
      db.query(insertQuery, [post_id, user_id, user_type], (err) => {
        if (err) {
          console.error('Error adding like:', err);
          return res.status(500).json({ error: 'Failed to like post' });
        }
        res.json({ message: 'Post liked successfully' });
      });
    }
  });
});

// Follow/Unfollow user
router.post('/follow/toggle', async (req, res) => {
  const { follower_id, follower_type, following_id, following_type } = req.body;

  const checkQuery = `
    SELECT * FROM Followers 
    WHERE follower_id = ? AND follower_type = ? 
    AND following_id = ? AND following_type = ?
  `;

  db.query(checkQuery, [follower_id, follower_type, following_id, following_type], (err, results) => {
    if (err) {
      console.error('Error checking follow status:', err);
      return res.status(500).json({ error: 'Failed to process follow request' });
    }

    if (results.length > 0) {
      // Unfollow
      const deleteQuery = `
        DELETE FROM Followers 
        WHERE follower_id = ? AND follower_type = ? 
        AND following_id = ? AND following_type = ?
      `;
      db.query(deleteQuery, [follower_id, follower_type, following_id, following_type], (err) => {
        if (err) {
          console.error('Error unfollowing:', err);
          return res.status(500).json({ error: 'Failed to unfollow user' });
        }
        res.json({ message: 'Unfollowed successfully' });
      });
    } else {
      // Follow
      const insertQuery = `
        INSERT INTO Followers (follower_id, follower_type, following_id, following_type)
        VALUES (?, ?, ?, ?)
      `;
      db.query(insertQuery, [follower_id, follower_type, following_id, following_type], (err) => {
        if (err) {
          console.error('Error following:', err);
          return res.status(500).json({ error: 'Failed to follow user' });
        }
        res.json({ message: 'Followed successfully' });
      });
    }
  });
});

// Send message
router.post('/messages', async (req, res) => {
  const { sender_id, sender_type, receiver_id, receiver_type, content } = req.body;

  const query = `
    INSERT INTO Messages (sender_id, sender_type, receiver_id, receiver_type, content)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [sender_id, sender_type, receiver_id, receiver_type, content], (err, result) => {
    if (err) {
      console.error('Error sending message:', err);
      return res.status(500).json({ error: 'Failed to send message' });
    }
    res.status(201).json({ message: 'Message sent successfully', message_id: result.insertId });
  });
});

// Get messages between two users
router.get('/messages/:user1_id/:user1_type/:user2_id/:user2_type', async (req, res) => {
  const { user1_id, user1_type, user2_id, user2_type } = req.params;

  const query = `
    SELECT * FROM Messages
    WHERE (sender_id = ? AND sender_type = ? AND receiver_id = ? AND receiver_type = ?)
    OR (sender_id = ? AND sender_type = ? AND receiver_id = ? AND receiver_type = ?)
    ORDER BY created_at ASC
  `;

  db.query(query, [
    user1_id, user1_type, user2_id, user2_type,
    user2_id, user2_type, user1_id, user1_type
  ], (err, results) => {
    if (err) {
      console.error('Error fetching messages:', err);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
    res.json(results);
  });
});

// Helper function to determine media type
function getMediaType(mimetype) {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  return 'document';
}

module.exports = router; 