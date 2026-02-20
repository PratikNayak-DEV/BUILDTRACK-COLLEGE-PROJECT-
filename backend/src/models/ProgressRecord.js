const mongoose = require('mongoose');

const progressRecordSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    detectedObjects: {
      type: [String],
      default: [],
    },
    detectedStage: {
      type: String,
      required: true,
    },
    progressPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProgressRecord', progressRecordSchema);
