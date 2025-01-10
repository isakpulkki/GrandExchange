const uploadsRouter = require('express').Router();
const fs = require('fs');
const path = require('path');
const express = require('express');
const uploadFolder = './uploads';
uploadsRouter.use(express.static(uploadFolder));

uploadsRouter.get('/:imageName', (request, response) => {
  const { imageName } = request.params;
  const imagePath = path.join(__dirname, uploadFolder, imageName);

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      return response.status(404).send('Image not found.');
    }
    response.sendFile(imagePath);
  });
});

module.exports = {
  uploadsRouter,
};
