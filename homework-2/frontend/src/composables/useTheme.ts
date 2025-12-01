import { ref, watch, onMounted } from 'vue';

type Theme = 'dark' | 'light';

const theme = ref<Theme>('dark');

export function useTheme() {
    const toggleTheme = () => {
        theme.value = theme.value === 'dark' ? 'light' : 'dark';
    };

    const setTheme = (newTheme: Theme) => {
        theme.value = newTheme;
    };

    const initTheme = () => {
        // Check localStorage first
        const savedTheme = localStorage.getItem('theme') as Theme | null;

        if (savedTheme) {
            theme.value = savedTheme;
        } else {
            // Fall back to system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme.value = prefersDark ? 'dark' : 'light';
        }

        applyTheme();
    };

    const applyTheme = () => {
        document.documentElement.setAttribute('data-theme', theme.value);
    };

    // Watch for theme changes and persist
    watch(theme, (newTheme) => {
        localStorage.setItem('theme', newTheme);
        applyTheme();
    });

    return {
        theme,
        toggleTheme,
        setTheme,
        initTheme,
    };
}
