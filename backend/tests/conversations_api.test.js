const mongoose = require('mongoose');
const User = require('../models/user');
const Conversation = require('../models/conversation');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

let token1;
let token2;
let user1;
let user2;

beforeAll(async () => {
  user1 = { username: 'User', password: 'Password' };
  user2 = { username: 'Username', password: 'Password' };
  await api.post('/api/users').send(user1).expect(201);
  await api.post('/api/users').send(user2).expect(201);
  const loginResponse1 = await api.post('/api/login').send(user1).expect(200);
  const loginResponse2 = await api.post('/api/login').send(user2).expect(200);
  token1 = `Bearer ${loginResponse1.body.token}`;
  token2 = `Bearer ${loginResponse2.body.token}`;
});

test('User can send a message to a another user.', async () => {
  const newMessage = {
    receiver: 'Username',
    message: 'Hello from User!',
  };
  const response = await api
    .post('/api/messages')
    .set('Authorization', token1)
    .send(newMessage)
    .expect(201);
  expect(response.body.success).toBe(true);
  expect(response.body.message).toBe('Message sent successfully!');
  expect(response.body.conversation.participants).toEqual(
    expect.arrayContaining(['User', 'Username'])
  );
  expect(response.body.conversation.messages[0].message).toBe(
    'Hello from User!'
  );
});

test('User can retrieve a conversation with a single user.', async () => {
  const response = await api
    .get('/api/messages/Username')
    .set('Authorization', token1)
    .expect(200);

  expect(response.body.success).toBe(true);
  expect(response.body.messages[0].message).toBe('Hello from User!');
});

test('User can retrieve their conversations.', async () => {
  const response = await api
    .get('/api/messages')
    .set('Authorization', token1)
    .expect(200);

  expect(response.body.success).toBe(true);
  expect(response.body.conversations).toHaveLength(1);
  expect(response.body.conversations[0].otherParticipant).toBe('Username');
  expect(response.body.conversations[0].lastMessage.message).toBe(
    'Hello from User!'
  );
});

afterAll(async () => {
  await User.deleteMany({});
  await Conversation.deleteMany({});
  await mongoose.connection.close();
});
