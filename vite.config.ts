import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/tic-tac-toe/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  resolve: {
    alias: {
      // Add polyfills for Node.js built-ins
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      assert: 'assert',
      zlib: 'browserify-zlib',
    },
  },
})
