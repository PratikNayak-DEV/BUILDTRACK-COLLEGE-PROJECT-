/**
 * Compares latest and previous progress records.
 * @param {{detectedStage:string, progressPercentage:number}} latestRecord
 * @param {{detectedStage:string, progressPercentage:number}|null} previousRecord
 */
function compareProgress(latestRecord, previousRecord) {
  if (!previousRecord) {
    return {
      hasPrevious: false,
      stageChanged: false,
      progressDifference: 0,
      summary: 'This is the first progress upload for this project.',
    };
  }

  const stageChanged = latestRecord.detectedStage !== previousRecord.detectedStage;
  const progressDifference = latestRecord.progressPercentage - previousRecord.progressPercentage;

  return {
    hasPrevious: true,
    previousStage: previousRecord.detectedStage,
    currentStage: latestRecord.detectedStage,
    stageChanged,
    progressDifference,
    summary: stageChanged
      ? `Stage changed from ${previousRecord.detectedStage} to ${latestRecord.detectedStage}.`
      : 'No stage change detected from previous upload.',
  };
}

module.exports = {
  compareProgress,
};
