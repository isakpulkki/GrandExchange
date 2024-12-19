const mongoose = require('mongoose');

const listingShchema = new mongoose.Schema({
  title: String,
  description: String,
  price: {
    type: Number,
    set: (value) => parseFloat(value).toFixed(2),
  },
  category: String,
  user: String,
});

listingShchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Listing', listingShchema);
