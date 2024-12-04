const express = require('express');
const app = express();
app.use(express.static('../frontend/dist'))

let listings = [
  {
    id: 1,
    title: 'Listing 1',
    description: 'This is a listing.',
  },
  {
    id: 2,
    title: 'Listing 2',
    description: 'This is a listing.',
  },
  {
    id: 3,
    title: 'Listing 3',
    description: 'This is a listing.',
  },
  {
    id: 4,
    title: 'Listing 4',
    description: 'This is a listing.',
  },
];

app.use(express.json());

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint.' });
};

app.get('/api/listings', (request, response) => {
  response.json(listings);
});

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
