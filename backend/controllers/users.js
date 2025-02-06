const config = require('../utils/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersRouter = require('express').Router();
const User = require('../models/user');
const middleware = require('../utils/middleware');
const { limiter } = require('../utils/limiter');

usersRouter.get('/', middleware.userExtractor, async (request, response) => {
  try {
    const { username, listings, admin } = request.user;

    if (!username || !listings) {
      return response.status(400).json({ error: 'User data is incomplete.' });
    }

    const userResponse = {
      username,
      listings: listings.filter((listing) => listing.visible === true),
      admin: admin === true,
    };

    response.status(200).json(userResponse);
  } catch (error) {
    response.status(500).json({ error: 'Internal server error.' });
  }
});

const validRegex = /^[A-Za-z0-9!"#€%&/()@]+$/;

usersRouter.post('/', limiter, async (request, response) => {
  const { username, password } = request.body;
  const { USERNAME_LIMITS, PASSWORD_LIMITS } = config;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({ error: 'Username is not unique.' });
  }

  if (
    username.length < USERNAME_LIMITS.MIN_LENGTH ||
    username.length > USERNAME_LIMITS.MAX_LENGTH
  ) {
    return response.status(400).json({
      error: `Username must be between ${USERNAME_LIMITS.MIN_LENGTH} and 
      ${USERNAME_LIMITS.MAX_LENGTH} characters long.`,
    });
  }

  if (!validRegex.test(username)) {
    return response.status(400).json({
      error:
        'Username can only contain letters, numbers, and some special symbols.',
    });
  }

  if (
    password.length < PASSWORD_LIMITS.MIN_LENGTH ||
    password.length > PASSWORD_LIMITS.MAX_LENGTH
  ) {
    return response.status(400).json({
      error: `Password must be between ${PASSWORD_LIMITS.MIN_LENGTH} and 
      ${PASSWORD_LIMITS.MAX_LENGTH} characters long.`,
    });
  }

  if (!validRegex.test(password)) {
    return response.status(400).json({
      error:
        'Password can only contain letters, numbers, and some special symbols.',
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, passwordHash });

  try {
    const savedUser = await user.save();
    const token = jwt.sign(
      { username: savedUser.username, id: savedUser.id },
      config.SECRET
    );
    response.status(201).send({ token });
  } catch (error) {
    response.status(500).json({ error: 'Internal server error.' });
  }
});

usersRouter.put('/', middleware.userExtractor, limiter, async (request, response) => {
  const { password } = request.body;
  const { PASSWORD_LIMITS } = config;

  try {
    const user = request.user;
    if (!user) {
      return response.status(401).json({ error: 'Unauthorized.' });
    }

    if (
      !password ||
      password.length < PASSWORD_LIMITS.MIN_LENGTH ||
      password.length > PASSWORD_LIMITS.MAX_LENGTH
    ) {
      return response.status(400).json({
        error: `Password must be between ${PASSWORD_LIMITS.MIN_LENGTH} and 
        ${PASSWORD_LIMITS.MAX_LENGTH} characters long.`,
      });
    }
    user.passwordHash = await bcrypt.hash(password, 10);
    await user.save();
    response.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    response.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = usersRouter;
