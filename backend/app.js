const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const listingsRouter = require('./controllers/listings');
const usersRouter = require('./controllers/users');
const categoriesRouter = require('./controllers/categories');
const loginRouter = require('./controllers/login');
const { uploadsRouter } = require('./controllers/uploads');
const middleware = require('./utils/middleware');
const config = require('./utils/config');
const path = require('path');
require('dotenv').config();

const app = express();

mongoose.set('strictQuery', false);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB.'))
  .catch(() => console.log('Error connecting to MongoDB.'));

app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use('/api/listings', listingsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/categories', categoriesRouter);
app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
});

module.exports = app;
