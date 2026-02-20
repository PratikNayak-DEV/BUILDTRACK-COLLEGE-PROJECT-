const vision = require('@google-cloud/vision');
const env = require('../config/env');

// Create Vision client with either JSON credentials or default credentials.
const client = env.googleCredentialsJson
  ? new vision.ImageAnnotatorClient({
      credentials: JSON.parse(env.googleCredentialsJson),
    })
  : new vision.ImageAnnotatorClient();

/**
 * Detects object labels from an image URL using Google Vision API.
 * @param {string} imageUrl
 * @returns {Promise<string[]>}
 */
async function detectImageObjects(imageUrl) {
  const [result] = await client.labelDetection({
    image: {
      source: {
        imageUri: imageUrl,
      },
    },
  });

  const labels = result.labelAnnotations || [];

  return labels.map((label) => String(label.description || '').toLowerCase()).filter(Boolean);
}

module.exports = {
  detectImageObjects,
};
