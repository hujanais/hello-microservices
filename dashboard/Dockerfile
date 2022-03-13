FROM arm64v8/node:14-bullseye-slim AS builder

# Set working directory
WORKDIR /usr/src/app

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

# copy the build output to replace the default nginx contents
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets from builder stage
COPY --from=build /usr/src/app/dist/shitto-app /usr/share/nginx/html
# COPY --from=builder /app/build /usr/share/nginx/html

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]

EXPOSE 80

STOPSIGNAL SIGTERM
