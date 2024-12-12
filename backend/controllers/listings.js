const listingsRouter = require('express').Router();
const Listing = require('../models/listing');
const middleware = require('../utils/middleware');
const LIMITS = { title: 100, description: 500, price: 10 };

listingsRouter.get('/', async (request, response) => {
  try {
    const listings = await Listing.find({});
    response.json(listings);
  } catch (error) {
    response.status(500).send('Error retrieving listings.');
  }
});

listingsRouter.post(
  '/',
  middleware.userExtractor,
  async (request, response) => {
    const { title, description, price } = request.body;
    const user = request.user;

    if (
      !title ||
      !description ||
      !price ||
      title.length > LIMITS.title ||
      description.length > LIMITS.description ||
      price.toString().length > LIMITS.price ||
      !Number.isInteger(price)
    ) {
      return response
        .status(400)
        .send(
          'All fields must be filled and within character limits. Price must be a valid integer.'
        );
    }

    try {
      const listing = new Listing({
        title,
        description,
        price,
        user: user.username,
      });
      const savedListing = await listing.save();
      user.listings = user.listings.concat(savedListing.id);
      await user.save();
      response.status(201).json(savedListing);
    } catch (error) {
      response.status(500).send('Error saving the listing.');
    }
  }
);

listingsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    try {
      const listing = await Listing.findById(request.params.id);

      if (listing.user.toString() !== request.user.username.toString()) {
        return response
          .status(400)
          .json({ error: 'Invalid user for this listing.' });
      }

      await Listing.findByIdAndDelete(listing.id);
      response.status(204).end();
    } catch (error) {
      response.status(500).send('Error deleting the listing.');
    }
  }
);

module.exports = listingsRouter;
