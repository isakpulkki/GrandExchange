const config = require('../utils/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersRouter = require('express').Router();
const User = require('../models/user');
const middleware = require('../utils/middleware');

// Get user data (listings)
usersRouter.get('/', middleware.userExtractor, async (request, response) => {
  try {
    const username = request.user.username;
    const listings = request.user.listings;
    if (!username || !listings) {
      return response.status(400).json({ error: 'User data is incomplete.' });
    }
    response.status(200).json({ listings });
  } catch (error) {
    response.status(500).json({ error: 'Internal server error.' });
  }
});

// Register a new user
usersRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  // Use LIMITS from config for username and password length validation
  const { USERNAME_LIMITS, PASSWORD_LIMITS } = config;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({ error: 'Username is not unique.' });
  }

  // Check if username length is within the configured limits
  if (
    username.length < USERNAME_LIMITS.MIN_LENGTH ||
    username.length > USERNAME_LIMITS.MAX_LENGTH
  ) {
    return response.status(400).json({
      error: `Username must be between ${USERNAME_LIMITS.MIN_LENGTH} and 
      ${USERNAME_LIMITS.MAX_LENGTH} characters long.`,
    });
  }

  // Check if password length is within the configured limits
  if (
    password.length < PASSWORD_LIMITS.MIN_LENGTH ||
    password.length > PASSWORD_LIMITS.MAX_LENGTH
  ) {
    return response.status(400).json({
      error: `Password must be between ${PASSWORD_LIMITS.MIN_LENGTH} and 
      ${PASSWORD_LIMITS.MAX_LENGTH} characters long.`,
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, passwordHash });
  const savedUser = await user.save();

  // Generate JWT token for the new user
  const token = jwt.sign(
    { username: savedUser.username, id: savedUser.id },
    config.SECRET
  );
  response.status(201).send({ token });
});

module.exports = usersRouter;
