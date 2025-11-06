import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://facebook-ui-ynk4.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
  },
});