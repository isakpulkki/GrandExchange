const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Listing = require('../models/listing');
const User = require('../models/user');

const initialListings = [
  {
    title: 'Item 1',
    description: 'This is the first items description.',
    price: 95,
    user: 'User',
  },
  {
    title: 'Item 2',
    description: 'This is the second items description.',
    price: 45,
    user: 'User',
  },
];

beforeEach(async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initialListings);
});

test('Listings are returned as JSON.', async () => {
  await api
    .get('/api/listings')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('Two listings are returned.', async () => {
  const response = await api.get('/api/listings');
  expect(response.body).toHaveLength(initialListings.length);
});

test('Listings have id -field.', async () => {
  const response = await api.get('/api/listings');
  expect(response.body[0].id).toBeDefined();
});

describe('When a listing is added by a new user...', () => {
  let token;

  beforeAll(async () => {
    await User.deleteMany({});
    const user = {
      username: 'Username',
      password: 'Password',
    };
    const loginResponse = await api.post('/api/users').send(user).expect(201);
    token = 'Bearer ' + loginResponse.body.token;
  });

  test('...Length of listings has risen by one.', async () => {
    const newListing = {
      title: 'Item 3',
      description: 'This is the third items description.',
      price: 65,
    };
    await api
      .post('/api/listings')
      .send(newListing)
      .set({ Authorization: token })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/listings');
    expect(response.body).toHaveLength(initialListings.length + 1);
  });

  test('...Bad request if title is not set.', async () => {
    const newListing = {
      description: 'This is the third items description.',
      price: 65,
    };
    const response = await api
      .post('/api/listings')
      .set({ Authorization: token })
      .send(newListing)
      .expect(400);
    expect(response.status).toBe(400);
  });

  test('...Listing can be removed by ID.', async () => {
    const newListing = {
      title: 'Item 3',
      description: 'This is the third items description.',
      price: 65,
    };
    const listingResponse = await api
      .post('/api/listings')
      .send(newListing)
      .set({ Authorization: token })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    await api
      .delete(`/api/listings/${listingResponse.body.id}`)
      .set({ Authorization: token })
      .expect(204);

    const responseAfterDelete = await api.get('/api/listings');
    expect(responseAfterDelete.body).toHaveLength(initialListings.length);
  });
});

test('Bad request when adding listing without token.', async () => {
  const newListing = {
    title: 'Lehmäkirja',
    description: 'This is the third items description.',
    price: 65,
  };
  const response = await api.post('/api/listings').send(newListing);
  expect(response.status).toBe(401);
});

afterAll(async () => {
  await Listing.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});