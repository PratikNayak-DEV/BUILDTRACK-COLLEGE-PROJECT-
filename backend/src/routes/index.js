const express = require('express');
const authRoutes = require('./authRoutes');
const projectRoutes = require('./projectRoutes');
const progressRoutes = require('./progressRoutes');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'BuildTrack backend is running',
  });
});

router.use(authRoutes);
router.use(requireAuth, projectRoutes);
router.use(requireAuth, progressRoutes);

module.exports = router;
