const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const listingsRouter = require('./controllers/listings');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');

const app = express();

mongoose.set('strictQuery', false);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB.'))
  .catch(() => console.log('Error connecting to MongoDB.'));

app.use(cors());
app.use(express.static('../frontend/dist'));
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use('/api/listings', listingsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

module.exports = app;
