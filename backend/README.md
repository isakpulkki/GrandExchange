# Backend

The backend is built with Node.js and Express, using MongoDB as the database for the GrandExchange application. Before running, make sure you have generated a `.env` -file, instructions given in the [README.md](/README.md).

### Usage

```bash
# Install the necessary dependencies
$ npm install

# Run the server in developement mode
$ npm run dev
```

To run the tests for the backend, MongoDB URI must be defined for the tests seperately.

```bash
# Setup ur your MongoDB URI for tests by filling it after the equation mark
$ echo "TEST_MONGODB_URI=" >> .env

# Run the tests
$ npm run test
```

Once the server is running, you can access the API locally at port `3000`.

### Categories
### Categories

Categories has to be added in to the MongoDB database manually for now. Categories have only one field, `name`.