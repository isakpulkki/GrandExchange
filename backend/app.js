const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const listingsRouter = require('./controllers/listings');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');
const path = require('path');
require('dotenv').config();

const app = express();

mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB.'))
  .catch(() => console.log('Error connecting to MongoDB.'));

app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use('/api/listings', listingsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
});

module.exports = app;
