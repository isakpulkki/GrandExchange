const mongoose = require('mongoose');
const User = require('../models/user');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

  test('Fails if the username is not unique.', async () => {
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

  test('Fails if the username is not at least three characters long.', async () => {
    const newUser = {
      username: 'Us',
      password: 'Password',
    };

    const response = await api.post('/api/users').send(newUser);
    expect(response.status).toBe(400);
  });

  
  test('Fails if the password is not at least eight characters long.', async () => {
    const newUser = {
      username: 'Usernam',
      password: 'Passwor',
    };

    const response = await api.post('/api/users').send(newUser);
    expect(response.status).toBe(400);
  });

  test('The user can log in and retrieve their users info.', async () => {
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

      const userResponse = await api
      .get('/api/users')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .expect(200);
  
      expect(userResponse.body.username).toBe('User');
  });



  test('Fails if the username contains invalid characters.', async () => {
    const newUser = {
      username: ' User ',
      password: 'Password',
    };

    const response = await api.post('/api/users').send(newUser).expect(400);

    expect(response.body.error).toBe(
      'Username can only contain letters, numbers, and some special symbols.'
    );
  });

  test('The password can be updated.', async () => {
    const newUser = {
      username: 'Use',
      password: 'Password',
    };
    const loginResponse = await api.post('/api/users').send(newUser);
    const updatedUser = {
      password: 'NewPassword',
    };

    const response = await api
      .put('/api/users')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(updatedUser)
      .expect(200);

    expect(response.body.message).toBe('Password updated successfully.');
  });


afterAll(async () => {

  await User.deleteMany({});
  await mongoose.connection.close();
});
