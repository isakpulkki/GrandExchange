const listingsRouter = require('express').Router();
const Listing = require('../models/listing');
const Category = require('../models/category');
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
    const { title, description, price, category } = request.body;
    const user = request.user;

    const { TITLE_MAX_LENGTH, DESCRIPTION_MAX_LENGTH, PRICE_MAX_LENGTH } =
      config.LISTING_LIMITS;

    if (
      !title ||
      !description ||
      !price ||
      !category ||
      title.length > TITLE_MAX_LENGTH ||
      description.length > DESCRIPTION_MAX_LENGTH ||
      price.toString().length > PRICE_MAX_LENGTH ||
      !Number.isInteger(price)
    ) {
      return response
        .status(400)
        .send(`All fields must be filled and within character limits.`);
    }

    try {
      const categories = await Category.find({});
      const categoryExists = categories.some((cat) => cat.name === category);
      console.log(category);
      if (!categoryExists) {
        return response
          .status(400)
          .send(`Category '${category}' does not exist.`);
      }
      const listing = new Listing({
        title,
        description,
        price,
        category,
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
