const listingsRouter = require('express').Router();
const Listing = require('../models/listing');
const Category = require('../models/category');
const config = require('../utils/config');
const middleware = require('../utils/middleware');
const uploadMiddleware = require('../utils/upload');

listingsRouter.get('/', async (request, response) => {
  try {
    const listings = await Listing.find({ visible: true }, { visible: 0 });
    response.json(listings);
  } catch (error) {
    response.status(500).send('Error retrieving listings.');
  }
});

listingsRouter.get('/:id', async (request, response) => {
  try {
    const listing = await Listing.findOne(
      { _id: request.params.id, visible: true },
      { visible: 0 }
    );

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
  uploadMiddleware.uploadImage.single('image'),
  async (request, response) => {
    const { title, description, price, category } = request.body;
    const user = request.user;
    const { TITLE_MAX_LENGTH, DESCRIPTION_MAX_LENGTH, PRICE_MAX_LENGTH } =
      config.LISTING_LIMITS;
    const priceInt = parseInt(price, 10);
    if (
      !title ||
      !description ||
      !priceInt ||
      !category ||
      title.length > TITLE_MAX_LENGTH ||
      description.length > DESCRIPTION_MAX_LENGTH ||
      priceInt.toString().length > PRICE_MAX_LENGTH ||
      !Number.isInteger(priceInt)
    ) {
      return response
        .status(400)
        .send(`All fields must be filled and within character limits.`);
    }
    try {
      const categories = await Category.find({});
      const categoryExists = categories.some((cat) => cat.name === category);
      if (!categoryExists) {
        return response
          .status(400)
          .send(`Category '${category}' does not exist.`);
      }
      const listing = new Listing({
        title,
        description,
        price: priceInt,
        category,
        user: user.username,
        image: request.file.filename,
        visible: true, // Set visible to true by default
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
      uploadMiddleware.deleteImage(listing.image);
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
