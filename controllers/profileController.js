const db = require('../db');
const fs = require('fs');
const path = require('path');

const updateProfile = async (req, res) => {
  const userId = req.userId;
  const bio = req.body.bio;
  const location = req.body.location;
  let dpUrl = null;

  if (req.file) {
    dpUrl = `/uploads/${req.file.filename}`;
  }

  try {
    await db.query(
      `UPDATE users 
       SET bio = $1, location = $2, dp = COALESCE($3, dp)
       WHERE id = $4`,
      [bio, location, dpUrl, userId]
    );
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

module.exports = { updateProfile };
