# Use the official Node.js image as the base image
FROM node:21-alpine

RUN apk add --no-cache bash
# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

RUN chmod +x /app/scripts/wait-for-it.sh

# Expose the port that the API will listen on
EXPOSE 3000
