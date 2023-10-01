# Use an official Node.js runtime as the base image with your specified version
FROM node:18.18.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install app dependencies using yarn
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the server
RUN yarn build:server

# Run the TypeScript build (assuming this is a custom script in your package.json)
RUN yarn build:ts

# Expose a port if your app requires it
EXPOSE 3000

# Define the command to run your application
CMD [ "yarn", "workspace", "server", "start" ]
