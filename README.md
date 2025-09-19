# GrandExchange

[![CI/CD](https://github.com/isakpulkki/GrandExchange/actions/workflows/workflow.yml/badge.svg)](https://github.com/isakpulkki/GrandExchange/actions/workflows/workflow.yml)
[![Codecov](https://codecov.io/gh/isakpulkki/GrandExchange/graph/badge.svg?token=KB82TVNFTP)](https://codecov.io/gh/isakpulkki/GrandExchange)

This project is a full-stack marketplace application named GrandExchange, built with React, TypeScript, Node.js and MongoDB.

The application allows users to register, browse, search, and manage item listings, with options to sort, filter, and categorize listings for easy discovery. Users can update their passwords, delete their own listings, and communicate via a built-in messaging system to facilitate transactions. An admin role ensures quality control by reviewing and approving new listings while having the authority to remove inappropriate content. The application is fully responsive, delivering a seamless and user-friendly experience across all devices.

The backend manages all APIs related to users, listings, and file storage. It implements rate limiting to prevent server overload and mitigate attacks. Strict input validation ensures that data submitted for registration, listings, and other interactions is structured correctly, preserving both UI stability and backend integrity. The API is  tested with Jest, while end-to-end (E2E) testing with Playwright guarantees frontend reliability. Continuous integration automatically tests the application before deployment to the server.

## Instructions

You can test the application live [here](https://grandexchange.pulkki.me). Accessing admin rights in the application happens with the user in the table above.

| Username  | Password |
| - | - |
| admin  | password  |

To run the application on your local machine, start by configuring the environment variables for the backend using the code below.

```bash
# Setup ur your MongoDB URI by filling it after the equation mark
$ echo "MONGODB_URI=" > backend/.env

# Setup a secret value after the equation mark, the secret can be any string
$ echo "SECRET=" >> backend/.env
```

To run the application with Docker, execute the following commands. 

```bash
# Build the Docker image for the application
$ docker build -t grandexchange .

# Run the Docker container in detached mode, mapped to port 3000
$ docker run -d -p 127.0.0.1:3000:3000 grandexchange
```

Once the Docker container is running, you can access the application locally at port `3000`.

Alternatively, you can run the [front-](/frontend) and [backend](/backend) separately by following the instructions in their directories.

### Categories

Categories has to be added in to the MongoDB database manually for now. Categories have only one field, `name`.

### Admin

To access admin rights with your user account, you need to grant the admin role manually in your MongoDB database. After creating a user, update the user document directly in the database by adding `admin: true`. 

Listings waiting for approval now show up in the 'My Account' -page.