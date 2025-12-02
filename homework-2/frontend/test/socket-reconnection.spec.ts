import { describe, it, expect, vi, beforeEach } from 'vitest';
import { socket, state, getConnectionStatus } from '../src/services/socket';

describe('Socket.IO Reconnection Configuration', () => {
    beforeEach(() => {
        // Reset state before each test
        state.connected = false;
        state.reconnecting = false;
        state.reconnectAttempts = 0;
        state.connectionError = null;
    });

    it('should have reconnection enabled', () => {
        expect(socket.io.opts.reconnection).toBe(true);
    });

    it('should have correct reconnection attempts configured', () => {
        expect(socket.io.opts.reconnectionAttempts).toBe(5);
        expect(state.maxReconnectAttempts).toBe(5);
    });

    it('should have correct reconnection delay configured', () => {
        expect(socket.io.opts.reconnectionDelay).toBe(1000);
        expect(socket.io.opts.reconnectionDelayMax).toBe(5000);
    });

    it('should have correct timeout configured', () => {
        expect(socket.io.opts.timeout).toBe(20000);
    });

    it('should have autoConnect disabled', () => {
        expect(socket.io.opts.autoConnect).toBe(false);
    });
});

describe('Connection State Management', () => {
    beforeEach(() => {
        state.connected = false;
        state.reconnecting = false;
        state.reconnectAttempts = 0;
        state.connectionError = null;
    });

    it('should return "Connected" when connected', () => {
        state.connected = true;
        expect(getConnectionStatus()).toBe('Connected');
    });

    it('should return reconnecting status with attempt count', () => {
        state.reconnecting = true;
        state.reconnectAttempts = 3;
        expect(getConnectionStatus()).toBe('Reconnecting (attempt 3/5)');
    });

    it('should return "Connection failed" when there is an error', () => {
        state.connectionError = 'Network error';
        expect(getConnectionStatus()).toBe('Connection failed');
    });

    it('should return "Disconnected" when not connected and no error', () => {
        expect(getConnectionStatus()).toBe('Disconnected');
    });
});

describe('Socket Event Handlers', () => {
    it('should have connect event handler registered', () => {
        const listeners = socket.listeners('connect');
        expect(listeners.length).toBeGreaterThan(0);
    });

    it('should have disconnect event handler registered', () => {
        const listeners = socket.listeners('disconnect');
        expect(listeners.length).toBeGreaterThan(0);
    });

    it('should have connect_error event handler registered', () => {
        const listeners = socket.listeners('connect_error');
        expect(listeners.length).toBeGreaterThan(0);
    });

    it('should have reconnect_attempt event handler registered', () => {
        const listeners = socket.listeners('reconnect_attempt');
        expect(listeners.length).toBeGreaterThan(0);
    });

    it('should have reconnect event handler registered', () => {
        const listeners = socket.listeners('reconnect');
        expect(listeners.length).toBeGreaterThan(0);
    });

    it('should have reconnect_failed event handler registered', () => {
        const listeners = socket.listeners('reconnect_failed');
        expect(listeners.length).toBeGreaterThan(0);
    });
});
