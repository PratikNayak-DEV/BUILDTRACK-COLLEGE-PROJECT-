const express = require('express');
const multer = require('multer');
const asyncHandler = require('../utils/asyncHandler');
const { uploadProgress } = require('../controllers/progressController');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post('/upload-progress', upload.single('image'), asyncHandler(uploadProgress));

module.exports = router;
