const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Listing = require('../models/listing');
const Category = require('../models/category');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const imagePath = path.join(__dirname, 'image.png');

const generateTestImage = (filePath) => {
  const width = 100;
  const height = 100;
  const content = Buffer.alloc(width * height * 3, 255);
  fs.writeFileSync(filePath, content);
};

const testImagePath = path.join(__dirname, 'image.png');
generateTestImage(testImagePath);
const initialListings = [
  {
    title: 'Item 1',
    description: 'This is the first items description.',
    category: 'Home and Furniture',
    price: 95,
    user: 'User',
    image: 'image.png',
  },
  {
    title: 'Item 2',
    description: 'This is the second items description.',
    category: 'Home and Furniture',
    price: 45,
    user: 'User',
    image: 'image.png',
  },
];

beforeAll(async () => {
  const category = new Category({ name: 'Home and Furniture' });
  await category.save();
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
    const user = {
      username: 'Username',
      password: 'Password',
    };
    const loginResponse = await api.post('/api/users').send(user).expect(201);
    token = 'Bearer ' + loginResponse.body.token;
  });

  test('...Length of listings has risen by one.', async () => {
    const imagePath = path.join(__dirname, 'image.png');

    const response = await api
      .post('/api/listings')
      .set({ Authorization: token })
      .field('title', 'Item 3')
      .field('description', "This is the third item's description.")
      .field('category', 'Home and Furniture')
      .field('price', 65)
      .attach('image', fs.createReadStream(imagePath));
    expect(response.status).toBe(201);
    const listings = await api.get('/api/listings');
    expect(listings.body).toHaveLength(initialListings.length + 1);
    await api
      .delete(`/api/listings/${response.body.id}`)
      .set({ Authorization: token })
      .expect(204);
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
    const response = await api
      .post('/api/listings')
      .set({ Authorization: token })
      .field('title', 'Item 3')
      .field('description', "This is the third item's description.")
      .field('category', 'Home and Furniture')
      .field('price', 65)
      .attach('image', fs.createReadStream(imagePath));

    await api
      .delete(`/api/listings/${response.body.id}`)
      .set({ Authorization: token })
      .expect(204);

    const responseAfterDelete = await api.get('/api/listings');
    expect(responseAfterDelete.body).toHaveLength(initialListings.length);
  });
});

test('Bad request when adding listing without token.', async () => {
  const newListing = {
    title: 'Item 3',
    description: 'This is the third items description.',
    price: 65,
  };
  const response = await api.post('/api/listings').send(newListing);
  expect(response.status).toBe(401);
});

afterAll(async () => {
  await User.deleteMany({});
  await Listing.deleteMany({});
  fs.access(imagePath, fs.constants.F_OK, () => {
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Error deleting the file: ', err.message);
      }
    });
  });
  await mongoose.connection.close();
});
