const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const listingsRouter = require('./controllers/listings');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const url = config.MONGODB_URI;
console.log('Connecting to MongoDB...');
mongoose
  .connect(url)
  .then((result) => {
    console.log('Connected to MongoDB.');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB.');
  });

app.use(cors());
app.use(express.static('../frontend/dist'));
app.use(express.json());
app.use('api/listings', listingsRouter);
module.exports = app;
