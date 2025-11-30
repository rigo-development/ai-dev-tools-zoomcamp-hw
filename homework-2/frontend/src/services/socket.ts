import { io, Socket } from 'socket.io-client';
import { reactive } from 'vue';

// Use reactive state to track connection status if needed
export const state = reactive({
    connected: false,
    fooEvents: [],
    barEvents: []
});

// "undefined" means the URL will be computed from the `window.location` object
// For dev, backend is usually on localhost:3000
const URL = import.meta.env.MODE === 'production' ? undefined : 'http://localhost:3000';

export const socket: Socket = io(URL, {
    autoConnect: false
});

socket.on('connect', () => {
    state.connected = true;
    console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
    state.connected = false;
    console.log('Disconnected from WebSocket server');
});
