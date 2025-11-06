import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API requests to Spring Boot backend (default Spring Boot port 8080)
    proxy: {
      '/api': {
        target: 'https://facebook-ui-ynk4.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});