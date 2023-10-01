# Use an official Node.js runtime as the base image with your specified version
FROM node:18.18.0

# Install Yarn and Node.js in the Docker image
RUN npm install -g yarn@1.22.19
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install app dependencies using yarn
RUN yarn install

# Copy the rest of the application code
COPY . .

# Run the build:server script (update this to match your actual script)
RUN yarn build:server

# Expose a port if your app requires it
EXPOSE 3000

# Define the command to run your application (update this to match your actual start command)
CMD [ "yarn", "workspace", "server", "start" ]
