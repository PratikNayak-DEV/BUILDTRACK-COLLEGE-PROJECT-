const express = require('express');
const projectRoutes = require('./projectRoutes');
const progressRoutes = require('./progressRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'BuildTrack backend is running',
  });
});

router.use(projectRoutes);
router.use(progressRoutes);

module.exports = router;
