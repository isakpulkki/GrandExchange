# GrandExchange

This project will be a full-stack marketplace application named GrandExchange built with React and TypeScript. It allows users to register, browse, search, and manage items for sale, with features like categorization, sorting, and item removal. An admin role will ensure quality by reviewing and approving listings. The app will be responsive and designed for a seamless user experience.

## Instructions

You can test the application live at [Fly.io](https://grandexchange.fly.dev). 

To run the application with Docker, run the following commands after cloning the repository to your local machine. 

```bash
# Setup ur your MongoDB URI by filling it after the equation mark
$ echo "MONGODB_URI=" > backend/.env

# Build the Docker image for the application
$ docker build -t grandexchange .

# Run the Docker container in detached mode, mapped to port 3000
$ docker run -d -p 127.0.0.1:3000:3000 grandexchange
```
Once the Docker container is running, you can access the application locally at port `3000`.