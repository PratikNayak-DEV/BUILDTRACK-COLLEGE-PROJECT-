const { STAGE_KEYWORDS, STAGE_ORDER, STAGE_WEIGHTS } = require('../utils/stageConfig');

/**
 * Normalizes label strings for stable keyword matching.
 * @param {string[]} detectedObjects
 * @returns {string[]}
 */
function normalizeObjects(detectedObjects = []) {
  return detectedObjects
    .map((item) => String(item || '').toLowerCase().trim())
    .filter(Boolean);
}

/**
 * Computes a keyword match score for each stage based on detected object labels.
 * @param {string[]} detectedObjects
 * @returns {Record<string, number>}
 */
function scoreStages(detectedObjects = []) {
  const normalized = normalizeObjects(detectedObjects);

  const stageScores = Object.fromEntries(STAGE_ORDER.map((stage) => [stage, 0]));

  STAGE_ORDER.forEach((stage) => {
    const keywords = STAGE_KEYWORDS[stage] || [];

    keywords.forEach((keyword) => {
      const hasMatch = normalized.some((label) => label.includes(keyword));
      if (hasMatch) {
        stageScores[stage] += 1;
      }
    });
  });

  return stageScores;
}

/**
 * Detects the most probable construction stage from Vision API labels.
 * If no stage has any positive score, returns `Unknown`.
 * @param {string[]} detectedObjects
 * @returns {{ detectedStage: string, progressPercentage: number, stageScores: Record<string, number> }}
 */
function detectConstructionStage(detectedObjects = []) {
  const stageScores = scoreStages(detectedObjects);

  const bestStage = STAGE_ORDER.reduce(
    (best, stage) => {
      if (stageScores[stage] > best.score) {
        return { stage, score: stageScores[stage] };
      }
      return best;
    },
    { stage: 'Unknown', score: 0 }
  );

  const detectedStage = bestStage.stage;
  const progressPercentage = detectedStage === 'Unknown' ? 0 : STAGE_WEIGHTS[detectedStage];

  return {
    detectedStage,
    progressPercentage,
    stageScores,
  };
}

/**
 * Validates whether the category selected by user matches detected stage.
 * @param {string} selectedCategory
 * @param {string} detectedStage
 * @returns {{ isValid: boolean, message: string|null }}
 */
function validateSelectedCategory(selectedCategory, detectedStage) {
  const normalizedSelected = String(selectedCategory || '').trim().toLowerCase();
  const normalizedDetected = String(detectedStage || '').trim().toLowerCase();

  if (!normalizedDetected || normalizedDetected === 'unknown' || normalizedSelected !== normalizedDetected) {
    return {
      isValid: false,
      message: 'Uploaded image does not match selected construction activity.',
    };
  }

  return {
    isValid: true,
    message: null,
  };
}

module.exports = {
  normalizeObjects,
  scoreStages,
  detectConstructionStage,
  validateSelectedCategory,
};
