import { io, Socket } from 'socket.io-client';
import { reactive } from 'vue';
import { env } from '@/config/env'

// Enhanced reactive state to track connection status and reconnection attempts
export const state = reactive({
    connected: false,
    reconnecting: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5,
    connectionError: null as string | null,
    fooEvents: [],
    barEvents: []
});

// "undefined" means the URL will be computed from the `window.location` object
// For dev, backend is usually on localhost:3000
const URL = env.VITE_BACKEND_URL || (env.MODE === 'production' ? undefined : 'http://localhost:3000');

export const socket: Socket = io(URL, {
    autoConnect: false,
    // Reconnection configuration for Render free tier
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    // Force websocket transport to avoid polling issues on Render
    transports: ['websocket']
});

// Connection event handlers
socket.on('connect', () => {
    state.connected = true;
    state.reconnecting = false;
    state.reconnectAttempts = 0;
    state.connectionError = null;
});

socket.on('disconnect', (reason) => {
    state.connected = false;

    // If disconnect was due to server or transport issues, reconnection will be attempted
    if (reason === 'io server disconnect') {
        // Server initiated disconnect, need to manually reconnect
        socket.connect();
    }
});

socket.on('connect_error', (error) => {
    state.connectionError = error.message;
    console.error('Connection error:', error.message);
});

socket.on('reconnect_attempt', (attemptNumber) => {
    state.reconnecting = true;
    state.reconnectAttempts = attemptNumber;
});

socket.on('reconnect', (_attemptNumber) => {
    state.reconnecting = false;
    state.reconnectAttempts = 0;
    state.connectionError = null;
});

socket.on('reconnect_failed', () => {
    state.reconnecting = false;
    state.connectionError = 'Failed to reconnect after maximum attempts';
    console.error('Reconnection failed after all attempts');
});

// Helper function to get user-friendly connection status
export function getConnectionStatus(): string {
    if (state.connected) {
        return 'Connected';
    } else if (state.reconnecting) {
        return `Reconnecting (attempt ${state.reconnectAttempts}/${state.maxReconnectAttempts})`;
    } else if (state.connectionError) {
        return 'Connection failed';
    } else {
        return 'Disconnected';
    }
}
