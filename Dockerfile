# Use a Node.js base image with the desired version
FROM node:18.18.0

# Install yarn globally
RUN npm install -g yarn

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install project dependencies
RUN yarn install --frozen-lockfile

# Copy the entire project directory into the container
COPY . .

# Build your server and client as per your script
RUN yarn workspace client unsafe:build && \
    rm -r apis/server/public && \
    mkdir apis/server/public && \
    cp -r apps/client/dist/ apis/server/public/ && \
    yarn workspace server build:ts

# Expose a port if your application listens on a specific port
# EXPOSE 8080

# Start your server and run "turbo run dev"
CMD ["yarn", "workspace", "server", "start", "&&", "yarn", "turbo", "run", "dev"]
