import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { astroCareApiPlugin } from './vite-api-plugin.ts'

export default defineConfig({
  plugins: [
    react(),
    astroCareApiPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-charts': ['recharts'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
