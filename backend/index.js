const express = require('express');
const app = express();
require('dotenv').config();

const Listing = require('./models/listing');

app.use(express.static('../frontend/dist'));

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted ID.' });
  }
  next(error);
};

const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/api/listings', (request, response) => {
  Listing.find({}).then((listings) => {
    response.json(listings);
  });
});

app.post('/api/listings', (request, response) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' });
  }

  const listing = new Listing({
    content: body.content,
    important: body.important || false,
  });

  listing.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.get('/api/listings/:id', (request, response, next) => {
  Listing.findById(request.params.id)
    .then((listing) => {
      if (listing) {
        response.json(listing);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete('/api/listings/:id', (request, response, next) => {
  Listing.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put('/api/listings/:id', (request, response, next) => {
  const body = request.body;
  const listing = {
    title: body.title,
    content: body.content,
  };

  Listing.findByIdAndUpdate(request.params.id, listing, { new: true })
    .then((updatedListing) => {
      response.json(updatedListing);
    })
    .catch((error) => next(error));
});
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
