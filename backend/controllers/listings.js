const listingsRouter = require('express').Router();
const Listing = require('../models/listing');

listingsRouter.get('/api/listings', (request, response) => {
    Listing.find({}).then((listings) => {
      response.json(listings);
    });
  });

module.exports = listingsRouter;