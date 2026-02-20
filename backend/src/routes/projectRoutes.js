const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { createProject, getProjectById, getProjectHistory } = require('../controllers/projectController');

const router = express.Router();

router.post('/projects', asyncHandler(createProject));
router.get('/project/:id', asyncHandler(getProjectById));
router.get('/project/:id/history', asyncHandler(getProjectHistory));

module.exports = router;
