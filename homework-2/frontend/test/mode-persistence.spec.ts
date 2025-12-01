import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import Home from '../src/views/Home.vue';
import InterviewRoom from '../src/views/InterviewRoom.vue';

describe('Mode Persistence Integration Tests', () => {
    let router;

    beforeEach(async () => {
        router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: '/', component: Home },
                { path: '/room/:id', component: InterviewRoom },
            ],
        });
        await router.isReady();
    });

    describe('Home Page - Mode Selection', () => {
        it('should default to local mode', async () => {
            const wrapper = mount(Home, {
                global: {
                    plugins: [router],
                },
            });

            const localOption = wrapper.find('.mode-option-compact.active');
            expect(localOption.text()).toContain('Local');
        });

        it('should allow switching to API mode', async () => {
            const wrapper = mount(Home, {
                global: {
                    plugins: [router],
                },
            });

            const apiOption = wrapper.findAll('.mode-option-compact')[1];
            await apiOption.trigger('click');

            const activeOption = wrapper.find('.mode-option-compact.active');
            expect(activeOption.text()).toContain('API');
        });

        it('should preserve mode from URL query parameter', async () => {
            await router.push('/?mode=api');

            const wrapper = mount(Home, {
                global: {
                    plugins: [router],
                },
            });

            await wrapper.vm.$nextTick();

            // Check that API mode is active
            const activeOption = wrapper.find('.mode-option-compact.active');
            expect(activeOption.text()).toContain('API');
        });
    });

    describe('Room Creation with Mode', () => {
        it('should create room with local mode by default', async () => {
            const wrapper = mount(Home, {
                global: {
                    plugins: [router],
                },
            });

            const createButton = wrapper.find('.create-card .card-button');
            await createButton.trigger('click');

            await wrapper.vm.$nextTick();

            // Check that router navigated with mode=local
            expect(router.currentRoute.value.query.mode).toBe('local');
        });

        it('should create room with selected API mode', async () => {
            const wrapper = mount(Home, {
                global: {
                    plugins: [router],
                },
            });

            // Select API mode
            const apiOption = wrapper.findAll('.mode-option-compact')[1];
            await apiOption.trigger('click');

            // Create room
            const createButton = wrapper.find('.create-card .card-button');
            await createButton.trigger('click');

            await wrapper.vm.$nextTick();

            // Check that router navigated with mode=api
            expect(router.currentRoute.value.query.mode).toBe('api');
        });
    });

    describe('Joining Room with Mode', () => {
        it('should join room with selected mode', async () => {
            const wrapper = mount(Home, {
                global: {
                    plugins: [router],
                },
            });

            // Enter room ID
            const input = wrapper.find('.room-input');
            await input.setValue('test123');

            // Select API mode
            const apiOption = wrapper.findAll('.mode-option-compact')[1];
            await apiOption.trigger('click');

            // Join room
            const joinButton = wrapper.find('.join-card .card-button');
            await joinButton.trigger('click');

            await wrapper.vm.$nextTick();

            // Check that router navigated with mode=api
            expect(router.currentRoute.value.path).toBe('/room/test123');
            expect(router.currentRoute.value.query.mode).toBe('api');
        });

        it('should preserve mode from URL when joining room', async () => {
            // Simulate coming from a share link with mode=api
            await router.push('/?mode=api');

            const wrapper = mount(Home, {
                global: {
                    plugins: [router],
                },
            });

            await wrapper.vm.$nextTick();

            // Enter room ID
            const input = wrapper.find('.room-input');
            await input.setValue('shared-room');

            // Join room (should use mode from URL)
            const joinButton = wrapper.find('.join-card .card-button');
            await joinButton.trigger('click');

            await wrapper.vm.$nextTick();

            // Check that mode=api is preserved
            expect(router.currentRoute.value.query.mode).toBe('api');
        });
    });

    describe('Interview Room - Mode Display', () => {
        it('should display local mode indicator', async () => {
            await router.push('/room/test123?mode=local');

            const wrapper = mount(InterviewRoom, {
                global: {
                    plugins: [router],
                    stubs: {
                        CodeEditor: true,
                        ThemeToggle: true,
                    },
                },
            });

            const modeIndicator = wrapper.find('.mode-indicator.local');
            expect(modeIndicator.exists()).toBe(true);
            expect(modeIndicator.text()).toContain('Local');
        });

        it('should display API mode indicator', async () => {
            await router.push('/room/test123?mode=api');

            const wrapper = mount(InterviewRoom, {
                global: {
                    plugins: [router],
                    stubs: {
                        CodeEditor: true,
                        ThemeToggle: true,
                    },
                },
            });

            const modeIndicator = wrapper.find('.mode-indicator.api');
            expect(modeIndicator.exists()).toBe(true);
            expect(modeIndicator.text()).toContain('API');
        });

        it('should default to API mode if no mode specified', async () => {
            await router.push('/room/test123');

            const wrapper = mount(InterviewRoom, {
                global: {
                    plugins: [router],
                    stubs: {
                        CodeEditor: true,
                        ThemeToggle: true,
                    },
                },
            });

            const modeIndicator = wrapper.find('.mode-indicator.api');
            expect(modeIndicator.exists()).toBe(true);
        });
    });

    describe('Share Link Generation', () => {
        it('should generate share link with current mode', async () => {
            await router.push('/room/abc123?mode=api');

            const wrapper = mount(InterviewRoom, {
                global: {
                    plugins: [router],
                    stubs: {
                        CodeEditor: true,
                        ThemeToggle: true,
                    },
                },
            });

            // Mock window.location.href
            Object.defineProperty(window, 'location', {
                value: {
                    href: 'http://localhost:8080/room/abc123?mode=api',
                },
                writable: true,
            });

            // Mock clipboard API
            const writeTextMock = vi.fn().mockResolvedValue(undefined);
            Object.assign(navigator, {
                clipboard: {
                    writeText: writeTextMock,
                },
            });

            const shareButton = wrapper.find('.share-btn');
            await shareButton.trigger('click');

            expect(writeTextMock).toHaveBeenCalledWith('http://localhost:8080/room/abc123?mode=api');
        });
    });
});
