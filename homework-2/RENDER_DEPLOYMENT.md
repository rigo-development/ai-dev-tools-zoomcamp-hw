# Render Deployment Guide

## Overview
This project is configured for deployment on Render.com. The backend is a NestJS application, and the frontend is a Vue 3 application served via Nginx (or as a static site).

## Service Configuration

### Backend (Web Service)
- **Runtime**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`
- **Environment Variables**:
  - `NODE_ENV`: production
  - `PORT`: 3000

### Frontend (Static Site)
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_BACKEND_URL`: The URL of your deployed backend service

## Free Tier Limitations & Handling

Render's free tier for Web Services has specific limitations that affect real-time applications:

1.  **Inactivity Sleep**: Services spin down after 15 minutes of inactivity.
2.  **Spin-up Delay**: It can take 30+ seconds for a sleeping service to wake up upon a new request.
3.  **Connection Drops**: When the service sleeps, all active WebSocket connections are terminated.

### Reconnection Strategy

To handle these limitations, the application implements a robust reconnection strategy:

-   **Auto-Reconnection**: The Socket.IO client is configured to attempt reconnection automatically.
-   **Exponential Backoff**: Reconnection attempts occur with increasing delays (1s to 5s) to avoid overwhelming the server during spin-up.
-   **Max Attempts**: It tries to reconnect 5 times before giving up.
-   **UI Feedback**: A status banner appears in the interview room to inform users of the connection state (Reconnecting, Disconnected, etc.).
-   **Auto-Rejoin**: Upon successful reconnection, the client automatically rejoins the active room to resume collaboration.

### Troubleshooting Connection Issues

If you experience connection problems:

1.  **"Reconnecting..." persists**: The backend might be waking up. Wait up to a minute.
2.  **"Connection failed"**: Refresh the page. If the issue persists, check if the backend service is healthy in the Render dashboard.
3.  **Code not syncing**: Ensure both users are in the same room ID. Check the connection status indicator.
4.  **"Server Error"**: This usually indicates a CORS or Transport issue.
    -   **CORS**: The backend is configured to allow all origins dynamically (`callback(null, true)`) to support credentials.
    -   **Transports**: The frontend is forced to use `websocket` transport to avoid polling issues on Render.

## Deployment Checklist

- [ ] Environment variables set correctly in Render dashboard
- [ ] Backend service deployed and healthy
- [ ] Frontend `VITE_BACKEND_URL` points to the correct backend URL
- [ ] CORS configured on backend to allow frontend origin
