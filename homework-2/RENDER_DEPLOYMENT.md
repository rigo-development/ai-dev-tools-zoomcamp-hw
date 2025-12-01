# Render Deployment Guide - Microservices Architecture

This guide walks you through deploying your application as **2 separate microservices** on Render using the Blueprint configuration.

## Architecture Overview

- **Backend Microservice**: NestJS API + WebSocket server (Docker)
- **Frontend Microservice**: Nginx serving Vue.js SPA + proxying requests to backend (Docker)

## Prerequisites

✅ All code changes committed and pushed to GitHub
✅ Backend service URL will be auto-injected into frontend via `render.yaml`

## Deployment Steps

### Step 1: Push Your Code

```bash
git add .
git commit -m "feat: microservices architecture with Render Blueprint"
git push origin main
```

### Step 2: Create Blueprint on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** button (top right)
3. Select **"Blueprint"**
4. Connect your GitHub repository
5. Render will detect `render.yaml` automatically

### Step 3: Review Services

Render will show you **2 services** to be created:

#### Backend Service
- **Name**: `backend`
- **Type**: Web Service
- **Runtime**: Docker
- **Plan**: Free
- **Environment**: `PORT=3000`

#### Frontend Service  
- **Name**: `frontend`
- **Type**: Web Service
- **Runtime**: Docker
- **Plan**: Free
- **Environment**: `BACKEND_URL` (auto-injected from backend service URL)

### Step 4: Deploy

1. Review the configuration
2. Click **"Apply"**
3. Render will:
   - Build both Docker images
   - Deploy backend first
   - Inject backend URL into frontend
   - Deploy frontend

**⏱️ Deployment Time**: 5-10 minutes (first deployment)

## Verification Checklist

After deployment completes:

### ✅ Check Backend Service

1. Go to **backend** service in Render Dashboard
2. Click the service URL (e.g., `https://backend-xyz.onrender.com`)
3. You should see: `"Backend is running! Access the Frontend service to use the application."`
4. Test health endpoint: `https://backend-xyz.onrender.com/api/health` → Should return `"OK"`

### ✅ Check Frontend Service

1. Go to **frontend** service in Render Dashboard
2. Click the service URL (e.g., `https://frontend-abc.onrender.com`)
3. You should see the **Home page** load correctly
4. Test creating a room:
   - Click "Create New Room"
   - Select execution mode
   - Room page should load
5. Test code execution:
   - Write some code
   - Click "Run Code"
   - Output should appear
6. Test page refresh:
   - Refresh the browser
   - Page should reload without errors (SPA routing works)

### ✅ Check WebSocket Connection

1. Open browser DevTools (F12) → Console tab
2. You should see: `"Connected to WebSocket server"`
3. No connection errors

## Environment Variables (Auto-Configured)

The `render.yaml` file automatically configures:

### Backend
- `PORT`: `3000`

### Frontend
- `BACKEND_URL`: Automatically set to backend service URL (e.g., `https://backend-xyz.onrender.com`)

## Troubleshooting

### Issue: Frontend shows "Cannot connect to backend"

**Solution**: 
1. Check backend service is running (green status in Render)
2. Verify `BACKEND_URL` environment variable in frontend service
3. Check frontend logs for connection errors

### Issue: 404 errors on page refresh

**Solution**: This shouldn't happen with the Nginx configuration, but if it does:
1. Check `frontend/nginx.conf` has `try_files $uri $uri/ /index.html;`
2. Verify `frontend/Dockerfile` is using `envsubst` correctly

### Issue: WebSocket connection fails

**Solution**:
1. Check `frontend/nginx.conf` has `/socket.io` location block
2. Verify backend service URL is accessible
3. Check CORS settings in `backend/src/main.ts`

## Cost

Both services are on the **Free tier**:
- ✅ Free for both services
- ⚠️ Services spin down after 15 minutes of inactivity
- ⚠️ First request after spin-down takes ~30 seconds

## Updating Your Deployment

When you push new code to GitHub:

1. Render auto-deploys if you enabled auto-deploy
2. Or manually trigger: Go to service → Click "Manual Deploy" → "Deploy latest commit"

## Local Testing

Before deploying, test locally with Docker Compose:

```bash
docker-compose up --build
```

Access at: `http://localhost:8080`

## Service URLs

After deployment, you'll have:

- **Frontend URL**: `https://frontend-[random].onrender.com` ← **Share this URL**
- **Backend URL**: `https://backend-[random].onrender.com` ← Internal use only

**Important**: Always share the **Frontend URL** with users!
