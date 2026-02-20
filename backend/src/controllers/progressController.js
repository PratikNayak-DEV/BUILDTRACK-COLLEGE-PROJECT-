const Project = require('../models/Project');
const ProgressRecord = require('../models/ProgressRecord');
const { uploadImageBuffer } = require('../services/cloudinaryService');
const { detectImageObjects } = require('../services/visionService');
const { detectConstructionStage, validateSelectedCategory } = require('../services/stageRuleEngine');
const { compareProgress } = require('../services/progressComparisonService');

async function uploadProgress(req, res) {
  const { projectId, category } = req.body;

  if (!projectId || !category) {
    return res.status(400).json({
      success: false,
      message: 'projectId and category are required.',
    });
  }

  if (!req.file || !req.file.buffer) {
    return res.status(400).json({
      success: false,
      message: 'Construction image is required.',
    });
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found.',
    });
  }

  // 1) Upload site image to Cloudinary
  const imageUrl = await uploadImageBuffer(req.file.buffer);

  // 2) Detect image objects with Vision API
  const detectedObjects = await detectImageObjects(imageUrl);

  // 3) Map objects to construction stage + weight-based progress
  const stageResult = detectConstructionStage(detectedObjects);

  // 4) Validate user selected category with detected stage
  const validation = validateSelectedCategory(category, stageResult.detectedStage);
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: validation.message,
      data: {
        detectedStage: stageResult.detectedStage,
      },
    });
  }

  // 5) Fetch previous record before inserting new one for comparison summary
  const previousRecord = await ProgressRecord.findOne({ projectId }).sort({ uploadedAt: -1 });

  // 6) Save current progress record
  const savedRecord = await ProgressRecord.create({
    projectId,
    imageUrl,
    detectedObjects,
    detectedStage: stageResult.detectedStage,
    progressPercentage: stageResult.progressPercentage,
  });

  const comparison = compareProgress(savedRecord, previousRecord);

  return res.status(201).json({
    success: true,
    message: 'Progress uploaded successfully.',
    data: {
      record: savedRecord,
      comparison,
    },
  });
}

module.exports = {
  uploadProgress,
};
