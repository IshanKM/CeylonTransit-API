# Dockerfile
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy everything else
COPY . .

# Expose app port
EXPOSE 3000

# Start the server
CMD ["node", "src/server.js"]
