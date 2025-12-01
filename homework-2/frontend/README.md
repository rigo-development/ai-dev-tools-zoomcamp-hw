# Frontend - Online Coding Interview Platform

Vue 3 + Vite frontend with Monaco Editor for real-time collaborative coding interviews.

## Features

- **Monaco Editor** - Professional code editor with syntax highlighting
- **Real-time Sync** - WebSocket-based collaboration
- **Multi-language** - Support for 8+ programming languages
- **Link Sharing** - Easy room URL sharing
- **Modern UI** - Dark theme with responsive design

## Tech Stack

- **Framework**: Vue 3.5 (Composition API)
- **Build Tool**: Vite 7.2
- **Editor**: Monaco Editor (@guolao/vue-monaco-editor)
- **WebSockets**: Socket.io Client 4.8
- **Router**: Vue Router 4.6
- **Language**: TypeScript

## Installation

```bash
npm install
```

## Running the Application

### Development Server
```bash
npm run dev
```
Runs on http://localhost:5173

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
src/
├── main.ts                    # Application entry point
├── App.vue                    # Root component
├── router/
│   └── index.ts              # Vue Router configuration
├── views/
│   └── InterviewRoom.vue     # Main interview interface
├── components/
│   └── CodeEditor.vue        # Monaco Editor wrapper
├── services/
│   └── socket.ts             # Socket.io client setup
└── assets/                   # Static assets
```

## Components

### InterviewRoom.vue
Main interview interface with:
- Header with room name, language selector, share button, run button
- Code editor pane (left)
- Output pane (right)

**Props**: None (uses route params)

**Features**:
- Real-time code synchronization
- Language selection
- Code execution
- Link sharing

### CodeEditor.vue
Monaco Editor wrapper component.

**Props**:
```typescript
{
  code: string,      // Current code content
  language: string   // Programming language
}
```

**Events**:
```typescript
{
  'update:code': (code: string) => void,  // Code changed
  'change': (code: string) => void         // Code changed (alias)
}
```

## Routing

### Routes
- `/` - Redirects to `/room/default-room`
- `/room/:id` - Interview room with dynamic room ID

### Navigation
```typescript
// Navigate to specific room
router.push('/room/my-custom-room');

// Get current room ID
const roomId = route.params.id;
```

## WebSocket Integration

### Socket Service (`src/services/socket.ts`)

```typescript
import { socket } from '@/services/socket';

// Connect
socket.connect();

// Join room
socket.emit('joinRoom', roomId);

// Listen for events
socket.on('codeUpdate', (code) => {
  // Handle code update
});

// Emit events
socket.emit('codeChange', { roomId, code });

// Disconnect
socket.disconnect();
```

### Event Handlers

#### Outgoing Events
- `joinRoom(roomId)` - Join interview room
- `codeChange({ roomId, code })` - Send code changes
- `languageChange({ roomId, language })` - Send language change
- `executeCode({ roomId, language, code })` - Execute code

#### Incoming Events
- `codeUpdate(code)` - Receive code from other users
- `languageChange(language)` - Receive language updates
- `executionResult(output)` - Receive execution output

## State Management

Uses Vue 3 Composition API with reactive refs:

```typescript
const code = ref('// Start coding here');
const output = ref('');
const executing = ref(false);
const selectedLanguage = ref('javascript');
const linkCopied = ref(false);
```

## Styling

### CSS Architecture
- **Scoped Styles** - Component-specific styles
- **Dark Theme** - Professional dark color scheme
- **Flexbox Layout** - Responsive layout system

### Color Palette
```css
--bg-primary: #1e1e1e;
--bg-secondary: #252526;
--border: #333;
--text-primary: #e0e0e0;
--accent: #0e639c;
```

## Development

### Hot Module Replacement
Vite provides instant HMR for fast development:
- Save file → See changes immediately
- State preserved during updates

### TypeScript
Full TypeScript support with type checking:
```bash
# Type check (if configured)
npx vue-tsc --noEmit
```

## Building for Production

### Build
```bash
npm run build
```

Output: `dist/` directory

### Preview Build
```bash
npm run preview
```

### Deployment
Deploy `dist/` folder to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

### Environment Variables
Create `.env` file:
```env
VITE_BACKEND_URL=http://localhost:3000
```

Access in code:
```typescript
const backendUrl = import.meta.env.VITE_BACKEND_URL;
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Monaco Editor requires modern browsers with ES6+ support.

## Features in Detail

### Link Sharing
Click "📋 Share Link" to copy current room URL:
```typescript
const copyShareLink = () => {
  const shareUrl = window.location.href;
  navigator.clipboard.writeText(shareUrl);
};
```

### Language Selection
Dropdown with 8 languages:
- JavaScript
- Python
- TypeScript
- Java
- C++
- Go
- Rust
- PHP

Changes sync across all users in real-time.

### Code Execution
1. Click "▶ Run Code"
2. Code sent to backend
3. Backend executes via Piston API
4. Output displayed in right pane
5. Results broadcast to all users

### Real-time Collaboration
- Type in editor → Changes broadcast via WebSocket
- Other users see updates instantly
- Cursor position preserved during updates
- No conflicts or overwrites

## Debugging

### Browser Console
Check console for:
- WebSocket connection status
- Event logs
- Errors

### Vue DevTools
Install Vue DevTools browser extension for:
- Component inspection
- State debugging
- Event tracking

### Network Tab
Monitor WebSocket frames:
1. Open DevTools → Network
2. Filter by WS (WebSocket)
3. Click connection
4. View Messages tab

## Troubleshooting

### Monaco Editor Not Loading
- Check internet connection (CDN resources)
- Clear browser cache
- Check console for errors

### WebSocket Connection Failed
- Ensure backend is running on port 3000
- Check CORS configuration
- Verify Socket.io client version matches server

### Code Not Syncing
- Check browser console for WebSocket events
- Verify both clients are in same room
- Check backend logs for event handling

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Performance Optimization

### Code Splitting
Vite automatically splits code by route:
```typescript
// Lazy load components
const InterviewRoom = () => import('./views/InterviewRoom.vue');
```

### Monaco Editor Optimization
Monaco is loaded asynchronously to reduce initial bundle size.

## Accessibility

- Keyboard navigation supported
- ARIA labels on interactive elements
- High contrast dark theme
- Focus indicators

## Testing

### Component Testing (Future)
```bash
# Install Vitest
npm install -D vitest @vue/test-utils

# Run tests
npm run test
```

### E2E Testing (Future)
```bash
# Install Playwright
npm install -D @playwright/test

# Run E2E tests
npx playwright test
```

## License

MIT
