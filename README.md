# GrandExchange

[![CI/CD](https://github.com/isakpulkki/GrandExchange/actions/workflows/workflow.yml/badge.svg)](https://github.com/isakpulkki/GrandExchange/actions/workflows/workflow.yml)
[![Codecov](https://codecov.io/gh/isakpulkki/GrandExchange/graph/badge.svg?token=KB82TVNFTP)](https://codecov.io/gh/isakpulkki/GrandExchange)

This project is a full-stack marketplace application named GrandExchange, built with React, TypeScript, Node.js and MongoDB.

It allows users to register, browse, search, and manage items for sale, featuring categorization, sorting, and item removal. An admin role ensures quality by reviewing and approving listings. The app is responsive and designed for a seamless user experience.

## Instructions

You can test the application live at [Fly.io](https://grandexchange.fly.dev). Accessing admin rights in the application happens with the user in the table above.

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

### Admin Rights

To access admin rights with your user account, you need to grant the admin role manually in your MongoDB database. After creating a user, update the user document directly in the database by adding `admin: true`. 

Listings waiting for approval now show up in the 'My Account' -page.