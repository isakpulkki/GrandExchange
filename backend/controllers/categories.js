const categoriesRouter = require('express').Router();
const Category = require('../models/category');

categoriesRouter.get('/', async (request, response) => {
  try {
    const categories = await Category.find({});
    response.json(categories);
  } catch (error) {
    response.status(500).send('Error retrieving the categories.');
  }
});

module.exports = categoriesRouter;
