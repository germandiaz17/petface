import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // En desarrollo, /api se redirige al backend Express (evita problemas de CORS)
    proxy: {
      '/api': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000',
      // Microservicio de notificaciones (otro servidor)
      '/notif': 'http://localhost:3001',
    },
  },
})
