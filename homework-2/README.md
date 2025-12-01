# Online Coding Interview Platform

A real-time collaborative coding interview platform built with Nest.js and Vue 3.

## Features

- ✅ **Real-time Code Collaboration** - Multiple users can edit code simultaneously with instant synchronization
- ✅ **Multi-language Support** - JavaScript, Python, TypeScript, Java, C++, Go, Rust, PHP
- ✅ **Safe Code Execution** - Runs code in isolated environment via Piston API
- ✅ **Link Sharing** - Easy candidate invitation with shareable room URLs
- ✅ **Modern UI** - Dark theme with Monaco Editor

## Project Structure

```
homework-2/
├── backend/          # Nest.js backend with WebSocket support
├── frontend/         # Vue 3 + Vite frontend
└── README.md         # This file
```

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Internet connection (for Piston API code execution)

### Installation

**Option 1: Install All Dependencies at Once**
```bash
npm run install:all
```

**Option 2: Install Manually**
```bash
# Install root dependencies (concurrently)
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Application

**Option 1: Run Both Servers Concurrently (Recommended)**
```bash
npm run dev
```
This starts both backend (http://localhost:3000) and frontend (http://localhost:5173) simultaneously.

**Option 2: Run Servers Separately**

1. **Start Backend** (Terminal 1)
```bash
cd backend
npm run start:dev
```
Backend runs on http://localhost:3000

2. **Start Frontend** (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:5173

3. **Open Browser**
Navigate to http://localhost:5173

## Testing

### Backend Tests
```bash
cd backend
npm test                    # Run unit tests
npm run test:e2e           # Run integration tests
npm run test:cov           # Run with coverage
```

### Frontend Tests
```bash
cd frontend
npm run test               # Run tests (when configured)
```

## Usage

### Creating an Interview Session
1. Open http://localhost:5173 (redirects to `/room/default-room`)
2. Or create custom room: http://localhost:5173/room/your-custom-room-name
3. Click "📋 Share Link" to copy the URL
4. Share with candidates

### During Interview
1. **Select Language** - Use dropdown in header
2. **Write Code** - Type in Monaco editor (left pane)
3. **Run Code** - Click "▶ Run Code" button
4. **View Output** - Check right pane for results

### Real-time Collaboration
- Open same room URL in multiple browser windows
- Code changes appear instantly in all windows
- Language selection syncs across all users
- Execution results broadcast to all participants

## Architecture

### Backend (Nest.js)
- **WebSocket Gateway** - Handles real-time communication via Socket.io
- **Execution Service** - Manages code execution via Piston API
- **Event Handlers** - `joinRoom`, `codeChange`, `languageChange`, `executeCode`

### Frontend (Vue 3)
- **Monaco Editor** - Professional code editor with syntax highlighting
- **Socket.io Client** - Real-time WebSocket communication
- **Vue Router** - Room-based routing
- **Reactive State** - Vue 3 Composition API

## API Documentation

### WebSocket Events

#### Client → Server
- `joinRoom(roomId: string)` - Join a specific room
- `codeChange({ roomId, code })` - Broadcast code changes
- `languageChange({ roomId, language })` - Sync language selection
- `executeCode({ roomId, language, code })` - Execute code

#### Server → Client
- `joinedRoom(roomId: string)` - Confirmation of room join
- `codeUpdate(code: string)` - Receive code from other users
- `languageChange(language: string)` - Receive language updates
- `executionResult(output: string)` - Receive execution output

## Development

### Backend Development
```bash
cd backend
npm run start:dev          # Watch mode
npm run lint              # Lint code
npm run format            # Format code
```

### Frontend Development
```bash
cd frontend
npm run dev               # Development server
npm run build             # Production build
npm run preview           # Preview production build
```

## Troubleshooting

### WebSocket Connection Issues
- Check that backend is running on port 3000
- Check browser console for connection errors
- Verify CORS settings in backend

### Code Execution Fails
- Ensure internet connection (Piston API is external)
- Check backend logs for API errors
- Verify language name is supported

### Real-time Sync Not Working
- Open browser console and check for WebSocket events
- Check backend terminal for event logs
- Ensure both clients are in the same room

## Technologies

- **Backend**: Nest.js, Socket.io, TypeScript
- **Frontend**: Vue 3, Vite, Monaco Editor, Socket.io Client
- **Code Execution**: Piston API
- **Testing**: Jest (backend), Vitest (frontend)

## Deployment

### Deploy to Render

1. Fork this repository to your GitHub account.
2. Create a new account on [Render](https://render.com).
3. Connect your GitHub account to Render.
4. Click "New +" and select "Blueprint".
5. Select your forked repository.
6. Render will automatically detect the `render.yaml` file and configure the deployment.
7. Click "Apply" to start the deployment.

The application will be deployed as a Docker container running both the backend and frontend.

## License

MIT

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request
