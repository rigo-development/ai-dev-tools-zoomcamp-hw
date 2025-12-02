# Stage 1: Build Frontend
FROM node:22-slim AS build
WORKDIR /app

# Declare build argument for Vite
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build frontend (Vite will use VITE_BACKEND_URL from ENV)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built artifacts from build stage
COPY --from=build /app/dist .

# Copy custom nginx configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Expose port 80
EXPOSE 80

# Start Nginx with envsubst to inject environment variables
CMD ["/bin/sh", "-c", "if [ -z \"$BACKEND_URL\" ]; then echo 'ERROR: BACKEND_URL environment variable is not set!'; exit 1; fi && envsubst '${BACKEND_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && cat /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
