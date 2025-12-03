# Use Node.js LTS as the base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_BASE_URL=http://api:4000/api

# Start the application
CMD ["npm", "start"]