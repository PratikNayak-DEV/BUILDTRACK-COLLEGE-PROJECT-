const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    numberOfBuildings: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

projectSchema.index({ owner: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Project', projectSchema);
