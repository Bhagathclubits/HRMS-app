# Use a Node.js base image with the desired version
FROM node:18.18.0

# Check if yarn is already installed before attempting to install it
RUN command -v yarn || npm install -g yarn

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install project dependencies
RUN yarn install

# Install Vite globally
RUN yarn global add create-vite
RUN yarn global add vite

# Copy the entire project directory into the container
COPY . .

# Navigate into the client directory
WORKDIR /app/apps/client

# Install client-specific dependencies
RUN yarn install

# Return to the main working directory
WORKDIR /app

# Build your server and client as per your script
RUN yarn workspace client unsafe:build && \
    rm -r apis/server/public && \
    mkdir apis/server/public && \
    cp -r apps/client/dist/ apis/server/public/ && \
    yarn workspace server build:ts

# Expose a port if your application listens on a specific port
EXPOSE 3000

# Start your server and run "turbo run dev"
CMD ["yarn", "workspace", "server", "start", "&&", "yarn", "turbo", "run", "dev"]
