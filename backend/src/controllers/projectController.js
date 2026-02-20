const Project = require('../models/Project');
const ProgressRecord = require('../models/ProgressRecord');

async function createProject(req, res) {
  const { name, numberOfBuildings } = req.body;

  if (!name || !numberOfBuildings) {
    return res.status(400).json({
      success: false,
      message: 'Project name and numberOfBuildings are required.',
    });
  }

  const project = await Project.create({
    name,
    numberOfBuildings: Number(numberOfBuildings),
  });

  return res.status(201).json({
    success: true,
    data: project,
  });
}

async function getProjectById(req, res) {
  const { id } = req.params;

  const project = await Project.findById(id).lean();
  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found.',
    });
  }

  const latestProgress = await ProgressRecord.findOne({ projectId: id }).sort({ uploadedAt: -1 }).lean();

  return res.json({
    success: true,
    data: {
      ...project,
      latestProgress,
    },
  });
}

async function getProjectHistory(req, res) {
  const { id } = req.params;

  const project = await Project.findById(id).lean();
  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found.',
    });
  }

  const records = await ProgressRecord.find({ projectId: id }).sort({ uploadedAt: -1 }).lean();

  return res.json({
    success: true,
    data: {
      project,
      history: records,
    },
  });
}

module.exports = {
  createProject,
  getProjectById,
  getProjectHistory,
};
