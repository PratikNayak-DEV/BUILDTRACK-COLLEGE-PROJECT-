const cloudinary = require('../config/cloudinary');

/**
 * Uploads image buffer to Cloudinary and returns the secure URL.
 * @param {Buffer} fileBuffer
 * @param {string} folder
 * @returns {Promise<string>}
 */
function uploadImageBuffer(fileBuffer, folder = 'buildtrack/progress') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
}

module.exports = {
  uploadImageBuffer,
};
