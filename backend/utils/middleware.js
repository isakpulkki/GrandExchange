const config = require('./config');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const tokenExtractor = (request, response, next) => {
  const token = request.get('authorization')?.replace('Bearer ', '');
  if (token) {
    request.token = token;
  }

  next();
};

const userExtractor = async (request, response, next) => {
  const { token } = request;
  if (!token) {
    return response.status(401).json({ error: 'Token is missing.' });
  }

  try {
    const decodedToken = jwt.verify(token, config.SECRET);
    if (request.method === 'GET') {
      request.user = await User.findById(decodedToken.id).populate('listings');
    } else {
      request.user = await User.findById(decodedToken.id);
    }

    if (!request.user) {
      return response.status(401).json({ error: 'Token is invalid.' });
    }
    next();
  } catch (error) {
    response.status(401).json({ error: 'Token verification failed.' });
  }
};

const adminExtractor = async (request, response, next) => {
  const { token } = request;
  if (!token) {
    return next();
  }
  try {
    const decodedToken = jwt.verify(token, config.SECRET);
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return next();
    }
    if (user.admin) {
      request.isAdmin = true;
    }
    next();
  } catch (error) {
    return next();
  }
};

module.exports = { tokenExtractor, userExtractor, adminExtractor };
