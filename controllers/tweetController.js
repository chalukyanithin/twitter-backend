const db = require('../db');
const jwt = require('jsonwebtoken');

// Create a tweet
const createTweet = async (req, res) => {
  const { content } = req.body;
  const userId = req.userId;

  try {
    await db.query(
      'INSERT INTO tweets (user_id, content) VALUES ($1, $2)',
      [userId, content]
    );
    res.status(201).json({ message: 'Tweet posted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error posting tweet' });
  }
};

// Get all tweets with like count
const getAllTweets = async (req, res) => {
  const userId = req.userId; // from verified token

  try {
    const result = await db.query(`
      SELECT 
        tweets.id, 
        tweets.content, 
        tweets.created_at, 
        users.username,
        EXISTS (
          SELECT 1 FROM likes 
          WHERE likes.tweet_id = tweets.id AND likes.user_id = $1
        ) AS liked_by_user,
        COUNT(likes.id) AS like_count
      FROM tweets
      JOIN users ON tweets.user_id = users.id
      LEFT JOIN likes ON tweets.id = likes.tweet_id
      GROUP BY tweets.id, users.username
      ORDER BY tweets.created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching tweets' });
  }
};

// Toggle Like on a Tweet
const toggleLike = async (req, res) => {
  const userId = req.userId;
  const tweetId = req.params.id;

  try {
    const existing = await db.query(
      'SELECT * FROM likes WHERE user_id = $1 AND tweet_id = $2',
      [userId, tweetId]
    );

    if (existing.rows.length > 0) {
      await db.query(
        'DELETE FROM likes WHERE user_id = $1 AND tweet_id = $2',
        [userId, tweetId]
      );
      return res.json({ message: 'Tweet unliked' });
    } else {
      await db.query(
        'INSERT INTO likes (user_id, tweet_id) VALUES ($1, $2)',
        [userId, tweetId]
      );
      return res.json({ message: 'Tweet liked' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error toggling like' });
  }
};

// Get like count for a tweet (optional endpoint)
const getLikeCount = async (req, res) => {
  const tweetId = req.params.id;

  try {
    const count = await db.query(
      'SELECT COUNT(*) FROM likes WHERE tweet_id = $1',
      [tweetId]
    );
    res.json({ tweetId, likes: parseInt(count.rows[0].count) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting like count' });
  }
};

module.exports = {
  createTweet,
  getAllTweets,
  toggleLike,
  getLikeCount
};
