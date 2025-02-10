# Frontend

The frontend is built with React.js and TypeScript for the GrandExchange application.

### Usage

```bash
# Install the necessary dependencies
$ npm install

# Run the server in development mode
$ npm run dev

```

To run the build version and the E2E tests, several things needs to be installed.

```bash
# Build the frontend
$ npm run build

# Install the serve package globally
$ npm install -g serve

# Serve the application
$ serve -s dist

# Install Playwright
$ npx playwright install

# Run the Playwright tests
$ npm run test:e2e

```

Once the server is running, the frontend should be up and accessible in your browser.
