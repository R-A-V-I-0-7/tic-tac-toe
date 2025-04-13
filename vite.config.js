import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [react()],
    base: isProduction ? '/tic-tac-toe/' : '/',
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      assetsDir: 'assets',
      assetsInlineLimit: 0
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  }
}) 