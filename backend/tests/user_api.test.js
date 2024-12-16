const User = require('../models/user');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

describe('New user is not added if...', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('...The username is not unique.', async () => {
    const newUser = {
      username: 'Userna',
      password: 'Password',
    };

    // First user creation should succeed
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const secondUser = {
      username: 'Userna',
      password: 'Password',
    };

    // Second user creation with the same username should fail
    const response = await api.post('/api/users').send(secondUser);
    expect(response.status).toBe(400);
  });

  test('...The username is not at least three characters long.', async () => {
    const newUser = {
      username: 'Us',
      password: 'Password',
    };

    const response = await api.post('/api/users').send(newUser);
    expect(response.status).toBe(400);
  });

  test('...The password is not at least eight characters long.', async () => {
    const newUser = {
      username: 'Usernam',
      password: 'Passwor',
    };

    const response = await api.post('/api/users').send(newUser);
    expect(response.status).toBe(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});