const express = require('express');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'BuildTrack backend is running',
  });
});

module.exports = router;
