import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    // Explicitly define environment variables for the client
    define: {
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(
        env.VITE_BACKEND_URL || env.BACKEND_URL || 'http://localhost:3000'
      ),
    },
    test: {
      globals: true,
      environment: 'happy-dom',
    },
  };
});
