const listingsRouter = require('express').Router();
const Listing = require('../models/listing');
const middleware = require('../utils/middleware');

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
    const { user } = request;

    if (!title || !description || !price) {
      return response.status(400).send('All fields must be filled.');
    }

    try {
      const listing = new Listing({
        title,
        description,
        price,
        user: user.id,
      });

      const savedListing = await listing.save();
      user.listings.push(savedListing.id);
      await user.save();

      await savedListing.populate('user', { username: 1 });
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

      if (listing.user.toString() !== request.user.id.toString()) {
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

listingsRouter.put('/:id', async (request, response) => {
  const { title, description, price } = request.body;

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      request.params.id,
      { title, description, price },
      { new: true }
    ).populate('user', { username: 1 });

    response.json(updatedListing);
  } catch (error) {
    response.status(500).send('Error updating the listing.');
  }
});

module.exports = listingsRouter;
