# Stage 1: Build
FROM node:22-slim AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build backend
RUN npm run build

# Stage 2: Production
FROM node:22-slim
WORKDIR /app

# Copy built artifacts
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/main"]
