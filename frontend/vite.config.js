import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Plugins
  plugins: [react()],

  // Server configuration for development
  server: {
    port: 3000,
    host: true,
    // Proxy API calls to backend during development
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
});