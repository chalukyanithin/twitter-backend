const express = require('express');
const router = express.Router();
const multer = require('multer');
const { updateProfile } = require('../controllers/profileController');
const authMiddleware = require('../middleware/middleware');

// Multer setup
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `dp-${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post('/update', authMiddleware, upload.single('dp'), updateProfile);

module.exports = router;
