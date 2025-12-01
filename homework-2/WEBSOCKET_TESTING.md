# WebSocket Collaboration Testing Guide

## Prerequisites

Both backend and frontend must be running for WebSocket collaboration to work.

## Setup

### 1. Start Backend Server

```bash
cd backend
npm run start:dev
```

**Expected output:**
```
[Nest] INFO [NestFactory] Starting Nest application...
[Nest] INFO [InstanceLoader] AppModule dependencies initialized
[Nest] INFO [RoutesResolver] AppController {/}:
[Nest] INFO [RouterExplorer] Mapped {/api/health, GET} route
[Nest] INFO [WebSocketsController] WebSocketGateway subscribed to the "message" event
[Nest] INFO [NestApplication] Nest application successfully started
```

Backend should be running on: `http://localhost:3000`

### 2. Start Frontend Server

```bash
cd frontend
npm run dev
```

Frontend should be running on: `http://localhost:5173` (or similar)

## Testing Real-Time Collaboration

### Test 1: Code Synchronization

1. **Open Tab 1**:
   - Go to `http://localhost:5173`
   - Click "Create New Room"
   - Note the room ID (e.g., `abc123`)

2. **Open Tab 2**:
   - Go to `http://localhost:5173`
   - Click "Join Existing Room"
   - Enter the room ID from Tab 1
   - Click "Join Room"

3. **Test Code Sync**:
   - In Tab 1: Type some code
   - **Expected**: Code should appear in Tab 2 in real-time
   - In Tab 2: Type different code
   - **Expected**: Code should appear in Tab 1 in real-time

### Test 2: Language Synchronization

1. In Tab 1: Change language to "Python"
2. **Expected**: Tab 2 should also change to "Python"

### Test 3: Code Execution Sync (API Mode)

1. Ensure both tabs are in API mode
2. In Tab 1: Write code and click "Run Code"
3. **Expected**: Output should appear in BOTH tabs

## Troubleshooting

### Issue: Code not syncing between tabs

**Check 1: Backend Running?**
```bash
curl http://localhost:3000/api/health
```
Should return: `OK`

**Check 2: WebSocket Connection**
- Open DevTools (F12) → Console tab
- Look for: `"Connected to WebSocket server"`
- If you see `"Disconnected"` or connection errors, backend isn't running

**Check 3: Same Room ID?**
- Verify both tabs show the same room ID in the header
- Example: "Interview Room: abc123"

**Check 4: CORS Issues?**
- Check browser console for CORS errors
- Backend should have CORS enabled (already configured)

### Issue: "Cannot connect to backend"

**Solution**:
1. Ensure backend is running: `npm run start:dev` in `backend/` directory
2. Check backend logs for errors
3. Verify port 3000 is not in use by another process

### Issue: WebSocket disconnects immediately

**Solution**:
1. Check `frontend/src/services/socket.ts` - URL should be `http://localhost:3000`
2. Restart both backend and frontend
3. Clear browser cache and reload

## Running Integration Tests

### Mode Persistence Tests

```bash
cd frontend
npm test mode-persistence.spec.ts
```

**Expected**: All tests should pass ✅

### All Frontend Tests

```bash
cd frontend
npm test
```

## Production Testing (Render)

For production on Render, WebSocket collaboration should work automatically because:

1. Frontend connects to backend via `BACKEND_URL` environment variable
2. Backend has CORS enabled for all origins
3. Nginx proxies WebSocket connections (`/socket.io` location)

**Test on Render**:
1. Open frontend URL in two different browsers/tabs
2. Create room in Tab 1, join same room in Tab 2
3. Type code in Tab 1 → Should appear in Tab 2

## Common Issues on Render

### WebSocket connection fails

**Check**:
1. Frontend service has `BACKEND_URL` environment variable set
2. Backend service is running (check logs)
3. No firewall blocking WebSocket connections

### Code syncs locally but not on Render

**Check**:
1. Nginx configuration includes `/socket.io` proxy (already configured)
2. Backend URL is correct (should be internal Render URL)
3. Both services are in the same region

## Debug Mode

To see detailed WebSocket logs:

**Frontend** (`InterviewRoom.vue`):
- Already has `console.log` statements for all socket events
- Check browser console for:
  - `"Code changed locally, emitting codeChange event"`
  - `"Received codeUpdate: ..."`

**Backend** (`events.gateway.ts`):
- Already has `console.log` statements
- Check backend logs for:
  - `"Client connected: ..."`
  - `"Client joined room ..."`
  - `"Code change in room ..."`
  - `"Broadcasting to other clients..."`
