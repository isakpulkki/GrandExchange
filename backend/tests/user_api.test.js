const User = require('../models/user');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

describe('When a new user is added...', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('...It fails if the username is not unique.', async () => {
    const newUser = {
      username: 'Userna',
      password: 'Password',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const secondUser = {
      username: 'Userna',
      password: 'Password',
    };

    const response = await api.post('/api/users').send(secondUser);
    expect(response.status).toBe(400);
  });

  test('...It fails if the username is not at least three characters long.', async () => {
    const newUser = {
      username: 'Us',
      password: 'Password',
    };

    const response = await api.post('/api/users').send(newUser);
    expect(response.status).toBe(400);
  });

  test('...It fails if the password is not at least eight characters long.', async () => {
    const newUser = {
      username: 'Usernam',
      password: 'Passwor',
    };

    const response = await api.post('/api/users').send(newUser);
    expect(response.status).toBe(400);
  });
  test('...The user can log in and receive a valid token.', async () => {
    const newUser = {
      username: 'User',
      password: 'Password',
    };
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const loginResponse = await api
      .post('/api/login')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // Ensure the response contains a token
    expect(loginResponse.body.token).toBeDefined();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
