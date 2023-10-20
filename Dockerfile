# Use Node.js version 18.18.0 as a parent image
FROM node:18.18.0

# Install Yarn globally using npm, but with the --force flag to avoid conflicts
RUN npm install -g --force yarn

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install project dependencies using Yarn
RUN yarn install

# Build the server
RUN yarn build:server

# Expose a port
EXPOSE 3000

# Define the command to start your Node.js application
CMD ["yarn", "workspace", "server", "start"]
