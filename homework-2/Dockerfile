# Stage 1: Build Frontend
FROM node:22-slim AS frontend-build
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source code
COPY frontend/ .

# Build frontend
RUN npm run build

# Stage 2: Build Backend
FROM node:22-slim AS backend-build
WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci

# Copy backend source code
COPY backend/ .

# Build backend
RUN npm run build

# Stage 3: Production
FROM node:22-slim
WORKDIR /app

# Copy backend build
COPY --from=backend-build /app/backend/dist ./dist
COPY --from=backend-build /app/backend/package*.json ./

# Copy frontend build to client directory (served by NestJS)
COPY --from=frontend-build /app/frontend/dist ./client

# Install production dependencies only
RUN npm ci --only=production

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/main"]
