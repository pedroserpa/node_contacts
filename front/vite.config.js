import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/contacts': {
        target: 'https://pedroserpa-nodejs.recruitment.alfasoft.pt', // backend API
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})