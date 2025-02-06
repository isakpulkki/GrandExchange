const listingsRouter = require('express').Router();
const Listing = require('../models/listing');
const Category = require('../models/category');
const config = require('../utils/config');
const middleware = require('../utils/middleware');
const uploadMiddleware = require('../utils/upload');
const { limiter } = require('../utils/limiter');

listingsRouter.get(
  '/',
  middleware.adminExtractor,
  async (request, response) => {
    try {
      const filter = request.isAdmin ? {} : { visible: true };
      const listings = await Listing.find(filter);
      response.json(listings);
    } catch (error) {
      response.status(500).send('Error retrieving listings.');
    }
  }
);

listingsRouter.get(
  '/:id',
  middleware.adminExtractor,
  async (request, response) => {
    try {
      const filter = request.isAdmin ? {} : { visible: true };

      const listing = await Listing.findOne({
        _id: request.params.id,
        ...filter,
      });

      if (!listing) {
        return response.status(404).send('Listing not found.');
      }

      response.json(listing);
    } catch (error) {
      response.status(500).send('Error retrieving the listing.');
    }
  }
);

listingsRouter.post(
  '/',
  limiter,
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
        visible: false,
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
  middleware.adminExtractor,
  middleware.userExtractor,
  async (request, response) => {
    try {
      const listing = await Listing.findById(request.params.id);
      if (!listing) {
        return response.status(404).json({ error: 'Listing not found.' });
      }
      if (
        !request.isAdmin &&
        listing.user.toString() !== request.user.username.toString()
      ) {
        return response.status(400).json({
          error: 'You do not have permission to delete this listing.',
        });
      }
      uploadMiddleware.deleteImage(listing.image);
      await Listing.findByIdAndDelete(listing.id);
      response.status(204).end();
    } catch (error) {
      response.status(500).send('Error deleting the listing.');
    }
  }
);

listingsRouter.patch(
  '/:id',
  middleware.adminExtractor,
  async (request, response) => {
    try {
      if (!request.isAdmin) {
        return response
          .status(403)
          .send('You do not have permission to update this listing.');
      }

      const listing = await Listing.findById(request.params.id);
      if (!listing) {
        return response.status(404).send('Listing not found.');
      }
      listing.visible = true;
      await listing.save();

      response.status(200).json(listing);
    } catch (error) {
      response.status(500).send('Error updating the listing.');
    }
  }
);

module.exports = listingsRouter;
