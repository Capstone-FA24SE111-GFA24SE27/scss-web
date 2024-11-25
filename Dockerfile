# Step 1: Build the React app
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Pass the environment variable at build time and bake it into the app
ARG VITE_SERVER_BASE_URL
ENV VITE_SERVER_BASE_URL=${VITE_SERVER_BASE_URL}

# Create a .env file dynamically to be used during the build
RUN echo "VITE_SERVER_BASE_URL=${VITE_SERVER_BASE_URL}" > .env

# Build the application with the environment variable baked in
RUN npm run build

# Step 2: Serve the static files using Nginx
FROM nginx:alpine AS serve

# Copy built files from the build stage to Nginx's default HTML location
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration, if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port Nginx will listen on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
