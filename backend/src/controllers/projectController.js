const Project = require('../models/Project');
const ProgressRecord = require('../models/ProgressRecord');

async function createProject(req, res) {
  const { name, numberOfBuildings } = req.body;
  const owner = req.user.userId;

  if (!name || !numberOfBuildings) {
    return res.status(400).json({
      success: false,
      message: 'Project name and numberOfBuildings are required.',
    });
  }

  const normalizedName = String(name).trim();

  const existing = await Project.findOne({ owner, name: normalizedName });
  if (existing) {
    return res.status(200).json({
      success: true,
      message: 'Project already exists for this user.',
      data: existing,
    });
  }

  const project = await Project.create({
    owner,
    name: normalizedName,
    numberOfBuildings: Number(numberOfBuildings),
  });

  return res.status(201).json({
    success: true,
    data: project,
  });
}

async function listProjects(req, res) {
  const owner = req.user.userId;
  const projects = await Project.find({ owner }).sort({ createdAt: -1 }).lean();

  return res.json({
    success: true,
    data: projects,
  });
}

async function getProjectById(req, res) {
  const { id } = req.params;
  const owner = req.user.userId;

  const project = await Project.findOne({ _id: id, owner }).lean();
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
  const owner = req.user.userId;

  const project = await Project.findOne({ _id: id, owner }).lean();
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
  listProjects,
  getProjectById,
  getProjectHistory,
};
