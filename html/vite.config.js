import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    /*proxy: {
      '/contacts': {
        target: 'http://localhost:3000', // backend API
        changeOrigin: true,
      }
    }*/
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})