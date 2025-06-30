const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/middleware');
const {
  createTweet,
  getAllTweets,
  toggleLike,
  getLikeCount
} = require('../controllers/tweetController');

router.post('/', authMiddleware, createTweet);
router.get('/', getAllTweets);

// 👇 New routes for like feature
router.post('/:id/like', authMiddleware, toggleLike);
router.get('/:id/likes', getLikeCount);

module.exports = router;

