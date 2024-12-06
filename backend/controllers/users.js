const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  // Check for unique username
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({ error: 'Username is not unique.' });
  }

  // Validate username and password length
  if (username.length < 3 || username.length > 20) {
    return response
      .status(400)
      .json({ error: 'Username must be between 3 and 20 characters long.' });
  }
  if (password.length < 8 || password.length > 64) {
    return response
      .status(400)
      .json({ error: 'Password must be between 8 and 64 characters long.' });
  }

  // Hash password and create user
  const passwordHash = await bcrypt.hash(password, 10); // default saltRounds value of 10
  const user = new User({ username, passwordHash });

  // Save user and generate token
  const savedUser = await user.save();
  const token = jwt.sign(
    { username: savedUser.username, id: savedUser.id },
    process.env.SECRET
  );

  response.status(200).send({ token, user: savedUser.username });
});

module.exports = usersRouter;
