const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from backend/.env if present.
dotenv.config({ path: path.join(__dirname, '../../.env') });

const requiredVars = ['PORT', 'MONGODB_URI', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  clientOrigin: process.env.CLIENT_ORIGIN || '*',
  mongodbUri: process.env.MONGODB_URI,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  googleCredentialsJson: process.env.GOOGLE_VISION_CREDENTIALS_JSON,
};
