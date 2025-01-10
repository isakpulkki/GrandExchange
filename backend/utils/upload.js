const multer = require('multer');
const fs = require('fs');
const path = require('path');
const uploadFolder = './uploads';
const config = require('../utils/config');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const timestamp = Date.now();
    const filename = `${timestamp}${fileExtension}`;
    cb(null, filename);
  },
});

function deleteImage(imageName) {
  const validFilenameRegex = /^\d+\.(png|jpg|jpeg)$/;

  if (!validFilenameRegex.test(imageName)) {
    console.error('Invalid filename: ', imageName);
    return;
  }

  const imagePath = path.join(__dirname, '..', uploadFolder, imageName);
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File not found: ', imagePath);
      return;
    }
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Error deleting the file: ', err.message);
      }
    });
  });
}

const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: config.MAX_IMAGE_SIZE,
  },
});

module.exports = {
  uploadImage,
  deleteImage,
};
