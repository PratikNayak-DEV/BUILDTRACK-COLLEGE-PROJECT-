const { STAGE_ORDER, STAGE_WEIGHTS } = require('../utils/stageConfig');

function stageIndex(stageName) {
  return STAGE_ORDER.findIndex((stage) => stage.toLowerCase() === String(stageName || '').toLowerCase());
}

/**
 * Compares latest and previous progress records and returns a detailed change summary.
 * @param {{detectedStage:string, progressPercentage:number, uploadedAt?:Date}} latestRecord
 * @param {{detectedStage:string, progressPercentage:number, uploadedAt?:Date}|null} previousRecord
 */
function compareProgress(latestRecord, previousRecord) {
  if (!previousRecord) {
    return {
      hasPrevious: false,
      stageChanged: false,
      direction: 'initial',
      progressDifference: 0,
      previousProgressPercentage: null,
      currentProgressPercentage: latestRecord.progressPercentage,
      summary: 'This is the first progress upload for this project.',
    };
  }

  const previousStage = previousRecord.detectedStage;
  const currentStage = latestRecord.detectedStage;
  const stageChanged = currentStage !== previousStage;

  const previousStageIndex = stageIndex(previousStage);
  const currentStageIndex = stageIndex(currentStage);

  const previousProgress = Number(previousRecord.progressPercentage) || STAGE_WEIGHTS[previousStage] || 0;
  const currentProgress = Number(latestRecord.progressPercentage) || STAGE_WEIGHTS[currentStage] || 0;
  const progressDifference = currentProgress - previousProgress;

  let direction = 'stable';
  if (progressDifference > 0 || (currentStageIndex > previousStageIndex && previousStageIndex >= 0)) {
    direction = 'forward';
  } else if (progressDifference < 0 || (currentStageIndex < previousStageIndex && currentStageIndex >= 0)) {
    direction = 'backward';
  }

  let summary = `No progress percentage change detected (${currentProgress}%).`;

  if (direction === 'forward') {
    summary = stageChanged
      ? `Progress advanced from ${previousStage} to ${currentStage} (+${progressDifference}%).`
      : `Progress increased within ${currentStage} (+${progressDifference}%).`;
  } else if (direction === 'backward') {
    summary = stageChanged
      ? `Progress moved backward from ${previousStage} to ${currentStage} (${progressDifference}%).`
      : `Progress dropped within ${currentStage} (${progressDifference}%).`;
  } else if (stageChanged) {
    summary = `Stage changed from ${previousStage} to ${currentStage} with no percentage delta.`;
  }

  return {
    hasPrevious: true,
    stageChanged,
    direction,
    previousStage,
    currentStage,
    previousProgressPercentage: previousProgress,
    currentProgressPercentage: currentProgress,
    progressDifference,
    summary,
    previousUploadedAt: previousRecord.uploadedAt || null,
    currentUploadedAt: latestRecord.uploadedAt || null,
  };
}

module.exports = {
  compareProgress,
};
