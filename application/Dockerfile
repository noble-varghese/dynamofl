# Use the official Node.js 10 Alpine image as the base image
FROM node:14-alpine 

RUN mkdir -p /usr/src/app

# Set the working directory in the container
WORKDIR /src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 8080
EXPOSE 8000

# Define the command to run the application
CMD npm run start
