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
    console.log('bnii');
    return response.status(401).json({ error: 'Token is missing.' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    request.user = await User.findById(decodedToken.id);
    if (!request.user) {
      return response.status(401).json({ error: 'Token is invalid.' });
    }
    next();
  } catch (error) {
    response.status(401).json({ error: 'Token verification failed.' });
  }
};

module.exports = { tokenExtractor, userExtractor };
