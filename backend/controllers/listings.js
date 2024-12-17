const listingsRouter = require('express').Router();
const Listing = require('../models/listing');
const middleware = require('../utils/middleware');
const config = require('../utils/config');

listingsRouter.get('/', async (request, response) => {
  try {
    const listings = await Listing.find({});
    response.json(listings);
  } catch (error) {
    response.status(500).send('Error retrieving listings.');
  }
});

listingsRouter.get('/:id', async (request, response) => {
  try {
    const listing = await Listing.findById(request.params.id);
    
    if (!listing) {
      return response.status(404).send('Listing not found.');
    }

    response.json(listing);
  } catch (error) {
    response.status(500).send('Error retrieving the listing.');
  }
});

listingsRouter.post(
  '/',
  middleware.userExtractor,
  async (request, response) => {
    const { title, description, price } = request.body;
    const user = request.user;

    const { TITLE_MAX_LENGTH, DESCRIPTION_MAX_LENGTH, PRICE_MAX_LENGTH } =
      config.LISTING_LIMITS;

    if (
      !title ||
      !description ||
      !price ||
      title.length > TITLE_MAX_LENGTH ||
      description.length > DESCRIPTION_MAX_LENGTH ||
      price.toString().length > PRICE_MAX_LENGTH ||
      !Number.isInteger(price)
    ) {
      return response
        .status(400)
        .send(
          `All fields must be filled and within character limits. 
          Title cannot exceed ${TITLE_MAX_LENGTH} characters, 
          Description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters, 
          and Price must be a valid integer within ${PRICE_MAX_LENGTH} characters.`
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
