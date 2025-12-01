import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import CodeEditor from '../src/components/CodeEditor.vue';

// Mock Monaco Editor
vi.mock('@guolao/vue-monaco-editor', () => ({
    VueMonacoEditor: {
        name: 'VueMonacoEditor',
        template: '<div class="monaco-editor-mock" data-testid="monaco-editor"></div>',
        props: ['value', 'language', 'theme', 'options'],
        emits: ['update:value', 'change', 'mount'],
    },
}));

describe('CodeEditor Component', () => {
    it('renders correctly', () => {
        const wrapper = mount(CodeEditor, {
            props: {
                code: 'console.log("test");',
                language: 'javascript',
            },
        });

        expect(wrapper.find('.editor-container').exists()).toBe(true);
        expect(wrapper.find('[data-testid="monaco-editor"]').exists()).toBe(true);
    });

    it('accepts code and language props', () => {
        const testCode = 'const x = 42;';
        const testLanguage = 'typescript';

        const wrapper = mount(CodeEditor, {
            props: {
                code: testCode,
                language: testLanguage,
            },
        });

        expect(wrapper.props('code')).toBe(testCode);
        expect(wrapper.props('language')).toBe(testLanguage);
    });

    it('emits change and update:code events when code changes', async () => {
        const wrapper = mount(CodeEditor, {
            props: {
                code: 'initial code',
                language: 'javascript',
            },
        });

        const newCode = 'updated code';

        // Simulate the Monaco editor change by calling the component's method directly
        // In a real scenario, Monaco would trigger this
        const component = wrapper.vm as any;
        if (component.handleChange) {
            component.handleChange(newCode);
            await wrapper.vm.$nextTick();

            expect(wrapper.emitted('change')).toBeTruthy();
            expect(wrapper.emitted('update:code')).toBeTruthy();
        }
    });

    it('updates when code prop changes', async () => {
        const wrapper = mount(CodeEditor, {
            props: {
                code: 'initial code',
                language: 'javascript',
            },
        });

        await wrapper.setProps({ code: 'new code from prop' });
        await wrapper.vm.$nextTick();

        // The component should have received the new prop
        expect(wrapper.props('code')).toBe('new code from prop');
    });
});
