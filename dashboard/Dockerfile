FROM arm64v8/node:14-bullseye-slim AS builder

# Set working directory
WORKDIR /app

# Copy project files to working dir
COPY . .

# npm install.
RUN npm install

# build the application
RUN npm run build

# nginx state for serving content
FROM arm64v8/nginx:1.21.6-alpine

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=builder /app/build .

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]

EXPOSE 80
