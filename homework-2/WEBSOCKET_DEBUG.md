# WebSocket Collaboration Debugging Guide

## ✅ Connection Working (200 OK)
Your WebSocket connection is now established! The issue is with event synchronization.

## Quick Debugging Steps

### Step 1: Check Browser Console (Both Tabs)

**Tab 1 (where you type):**
Open DevTools (F12) → Console tab

**Expected logs when typing:**
```
Code changed locally, emitting codeChange event
```

**If you DON'T see this log:**
→ The CodeEditor isn't triggering the `@change` event
→ Try typing more characters or pressing Enter

**Tab 2 (where code should appear):**
Open DevTools (F12) → Console tab

**Expected logs:**
```
Connected to WebSocket server
Received codeUpdate: <your code>...
```

**If you see "Connected" but NOT "Received codeUpdate":**
→ Backend isn't broadcasting or tabs aren't in same room

### Step 2: Verify Same Room ID

**Check both tabs:**
- Look at the header: "Interview Room: **abc123**"
- Both tabs MUST show the **exact same room ID**

**If different:**
→ Create new room in Tab 1
→ Copy the URL
→ Paste URL in Tab 2 (don't use "Join Room" feature)

### Step 3: Check Backend Logs (Render)

1. Go to Render Dashboard
2. Click **Backend Service**
3. Click **Logs** tab
4. Type in Tab 1, watch logs

**Expected logs:**
```
Client connected: <socket-id>
Client <socket-id> joined room abc123
Code change in room abc123 from client <socket-id>
Broadcasting to other clients in room abc123
```

**If you DON'T see "Broadcasting":**
→ Backend isn't receiving the event
→ Check that both tabs show "Connected to WebSocket server"

### Step 4: Test with Simple Steps

**Tab 1:**
1. Open: `https://code-interview-fe.onrender.com`
2. Click "Create New Room"
3. **Copy the full URL** from address bar
4. Type: `console.log("test")`
5. Check console for: `"Code changed locally, emitting codeChange event"`

**Tab 2:**
1. **Paste the URL** from Tab 1
2. Wait for page to load
3. Check console for: `"Connected to WebSocket server"`
4. Check console for: `"Received codeUpdate: console.log..."`

### Step 5: Common Issues

**Issue: Console shows "Code changed locally" but Tab 2 doesn't update**

**Possible causes:**
1. **Different room IDs** - Verify URLs match exactly
2. **Backend not broadcasting** - Check backend logs
3. **Tab 2 not listening** - Refresh Tab 2

**Issue: No "Code changed locally" message**

**Cause**: CodeEditor not emitting change events

**Solution**: 
- Try typing multiple characters
- Try pressing Enter
- Try changing language first

**Issue: "Disconnected from WebSocket server"**

**Cause**: Backend connection lost

**Solution**:
- Check backend service is running (green status in Render)
- Refresh both tabs
- Check BACKEND_URL is set correctly

## Manual Test

If automatic sync isn't working, test manually:

**In Browser Console (Tab 1):**
```javascript
// Check if socket is connected
window.socket = socket;
console.log('Connected:', socket.connected);

// Manually emit event
socket.emit('codeChange', { roomId: 'test123', code: 'manual test' });
```

**In Browser Console (Tab 2):**
```javascript
// Listen for updates
socket.on('codeUpdate', (code) => {
  console.log('Received:', code);
});
```

## Expected Behavior

**When working correctly:**
1. Type in Tab 1 → See "Code changed locally" in console
2. Within 100ms → See "Received codeUpdate" in Tab 2 console
3. Code appears in Tab 2 editor in real-time

## Still Not Working?

Check these files for issues:

1. **frontend/src/components/CodeEditor.vue** - Must emit `@change` event
2. **frontend/src/views/InterviewRoom.vue** - Must have `@change="onCodeChange"`
3. **backend/src/events/events.gateway.ts** - Must broadcast to room

## Next Steps

If still not working after these checks, share:
1. Console logs from both tabs
2. Backend logs from Render
3. The exact room URLs you're using
