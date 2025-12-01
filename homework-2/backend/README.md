# Backend - Online Coding Interview Platform

Nest.js backend with WebSocket support for real-time collaborative coding interviews.

## Features

- **WebSocket Gateway** - Real-time bidirectional communication via Socket.io
- **Room Management** - Isolated interview sessions
- **Code Execution** - Safe execution via Piston API
- **Language Support** - 8+ programming languages
- **Event Logging** - Comprehensive debugging logs

## Tech Stack

- **Framework**: Nest.js 11
- **WebSockets**: Socket.io 4.8
- **Language**: TypeScript 5.7
- **Testing**: Jest 29
- **Runtime**: Node.js 18+

## Installation

```bash
npm install
```

## Running the Application

### Development Mode (with watch)
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## Testing

### Run All Tests
```bash
npm test
```

### Run Integration Tests
```bash
npm run test:e2e
```

### Run Tests with Coverage
```bash
npm run test:cov
```

### Watch Mode
```bash
npm run test:watch
```

## Project Structure

```
src/
├── app.module.ts              # Main application module
├── app.controller.ts          # Basic health check endpoint
├── app.service.ts             # Application service
├── main.ts                    # Application entry point
├── events/
│   └── events.gateway.ts      # WebSocket event handlers
└── execution/
    └── execution.service.ts   # Code execution service

test/
├── app.e2e-spec.ts           # End-to-end tests
└── events.gateway.integration.spec.ts  # Integration tests
```

## WebSocket Events

### Client → Server

#### `joinRoom`
Join a specific interview room.
```typescript
socket.emit('joinRoom', roomId: string);
```

#### `codeChange`
Broadcast code changes to other users in the room.
```typescript
socket.emit('codeChange', {
  roomId: string,
  code: string
});
```

#### `languageChange`
Sync language selection across all users.
```typescript
socket.emit('languageChange', {
  roomId: string,
  language: string
});
```

#### `executeCode`
Execute code and broadcast results.
```typescript
socket.emit('executeCode', {
  roomId: string,
  language: string,
  code: string
});
```

### Server → Client

#### `joinedRoom`
Confirmation of successful room join.
```typescript
socket.on('joinedRoom', (roomId: string) => {});
```

#### `codeUpdate`
Receive code changes from other users.
```typescript
socket.on('codeUpdate', (code: string) => {});
```

#### `languageChange`
Receive language updates from other users.
```typescript
socket.on('languageChange', (language: string) => {});
```

#### `executionResult`
Receive code execution output.
```typescript
socket.on('executionResult', (output: string) => {});
```

## Code Execution

The backend uses the [Piston API](https://github.com/engineer-man/piston) for safe code execution.

### Supported Languages
- JavaScript (Node.js)
- Python
- TypeScript
- Java
- C++
- Go
- Rust
- PHP

### Execution Flow
1. Client sends `executeCode` event
2. Backend forwards code to Piston API
3. Piston executes code in isolated container
4. Backend receives output (stdout/stderr)
5. Backend broadcasts `executionResult` to all clients in room

## Configuration

### CORS
WebSocket CORS is configured to allow all origins:
```typescript
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
```

For production, update to specific origins:
```typescript
cors: {
  origin: ['https://yourdomain.com'],
}
```

### Port
Default port: `3000`

To change, update `main.ts`:
```typescript
await app.listen(3001);
```

## Development

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```

## Debugging

### Console Logs
The application includes extensive logging:
- Client connections/disconnections
- Room joins
- Code changes
- Language changes
- Code execution

Check terminal output for real-time event logs.

### Debug Mode
Run with debugger attached:
```bash
npm run start:debug
```

Then attach your IDE debugger to port 9229.

## Testing Integration

### Manual Testing with Socket.io Client
```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected');
  socket.emit('joinRoom', 'test-room');
});

socket.on('joinedRoom', (roomId) => {
  console.log('Joined room:', roomId);
  socket.emit('codeChange', {
    roomId: 'test-room',
    code: 'console.log("test");'
  });
});
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)
```

### WebSocket Connection Failed
- Ensure backend is running
- Check firewall settings
- Verify CORS configuration

### Code Execution Timeout
- Check internet connection (Piston API is external)
- Increase timeout in execution service
- Check Piston API status

## Performance Considerations

- **Room Isolation**: Each room is independent, no cross-room communication
- **Broadcast Optimization**: Code changes only sent to other users, not sender
- **Connection Pooling**: Socket.io handles connection pooling automatically

## Security

- **Input Validation**: All events should validate input (add as needed)
- **Rate Limiting**: Consider adding rate limiting for production
- **Code Execution**: Piston API provides sandboxed execution
- **CORS**: Configure strict CORS for production

## License

MIT
