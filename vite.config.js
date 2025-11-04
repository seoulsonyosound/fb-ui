// vite.config.js
import { defineConfig } from 'vite';
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://facebook-ui-ynk4.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});