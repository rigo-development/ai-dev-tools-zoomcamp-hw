import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import InterviewRoom from '../src/views/InterviewRoom.vue';
import { createRouter, createMemoryHistory, Router } from 'vue-router';

// Mock socket.io-client with factory function
vi.mock('../src/services/socket', () => {
    const mockSocket = {
        connect: vi.fn(),
        disconnect: vi.fn(),
        emit: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
    };
    return {
        socket: mockSocket,
    };
});

// Mock Monaco Editor
vi.mock('@guolao/vue-monaco-editor', () => ({
    VueMonacoEditor: {
        name: 'VueMonacoEditor',
        template: '<div class="monaco-editor-mock" data-testid="monaco-editor"></div>',
        props: ['value', 'language', 'theme', 'options'],
        emits: ['update:value', 'change', 'mount'],
    },
}));

describe('InterviewRoom Component', () => {
    let router: Router;
    let mockSocket: any;

    beforeEach(async () => {
        // Get the mocked socket
        const socketModule = await import('../src/services/socket');
        mockSocket = socketModule.socket;

        // Create a router for testing
        router = createRouter({
            history: createMemoryHistory(),
            routes: [
                {
                    path: '/room/:id',
                    component: InterviewRoom,
                },
            ],
        });

        // Clear all mocks
        vi.clearAllMocks();
    });

    it('renders correctly', async () => {
        router.push('/room/test-room');
        await router.isReady();

        const wrapper = mount(InterviewRoom, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find('.room-container').exists()).toBe(true);
        expect(wrapper.find('.header').exists()).toBe(true);
        expect(wrapper.find('.editor-pane').exists()).toBe(true);
        expect(wrapper.find('.output-pane').exists()).toBe(true);
    });

    it('displays correct room ID from route params', async () => {
        router.push('/room/my-custom-room');
        await router.isReady();

        const wrapper = mount(InterviewRoom, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.text()).toContain('my-custom-room');
    });

    it('connects to socket on mount', async () => {
        router.push('/room/test-room');
        await router.isReady();

        mount(InterviewRoom, {
            global: {
                plugins: [router],
            },
        });

        await flushPromises();

        expect(mockSocket.connect).toHaveBeenCalled();
        expect(mockSocket.emit).toHaveBeenCalledWith('joinRoom', 'test-room');
    });

    it('disconnects socket on unmount', async () => {
        router.push('/room/test-room');
        await router.isReady();

        const wrapper = mount(InterviewRoom, {
            global: {
                plugins: [router],
            },
        });

        wrapper.unmount();

        expect(mockSocket.disconnect).toHaveBeenCalled();
        expect(mockSocket.off).toHaveBeenCalledWith('codeUpdate');
        expect(mockSocket.off).toHaveBeenCalledWith('executionResult');
        expect(mockSocket.off).toHaveBeenCalledWith('languageChange');
    });

    it('sets up socket event listeners on mount', async () => {
        router.push('/room/test-room');
        await router.isReady();

        mount(InterviewRoom, {
            global: {
                plugins: [router],
            },
        });

        await flushPromises();

        expect(mockSocket.on).toHaveBeenCalledWith('codeUpdate', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('executionResult', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('languageChange', expect.any(Function));
    });

    it('has language selector', async () => {
        router.push('/room/test-room');
        await router.isReady();

        const wrapper = mount(InterviewRoom, {
            global: {
                plugins: [router],
            },
        });

        const languageSelector = wrapper.find('.language-selector');
        expect(languageSelector.exists()).toBe(true);
    });

    it('has run code button', async () => {
        router.push('/room/test-room');
        await router.isReady();

        const wrapper = mount(InterviewRoom, {
            global: {
                plugins: [router],
            },
        });

        const runButton = wrapper.find('.run-btn');
        expect(runButton.exists()).toBe(true);
        expect(runButton.text()).toContain('Run Code');
    });

    it('has share link button', async () => {
        router.push('/room/test-room');
        await router.isReady();

        const wrapper = mount(InterviewRoom, {
            global: {
                plugins: [router],
            },
        });

        const shareButton = wrapper.find('.share-btn');
        expect(shareButton.exists()).toBe(true);
        expect(shareButton.text()).toContain('Share Link');
    });

    it('displays output pane', async () => {
        router.push('/room/test-room');
        await router.isReady();

        const wrapper = mount(InterviewRoom, {
            global: {
                plugins: [router],
            },
        });

        const outputPane = wrapper.find('.output-pane');
        expect(outputPane.exists()).toBe(true);
        expect(outputPane.text()).toContain('Output');
    });
});
