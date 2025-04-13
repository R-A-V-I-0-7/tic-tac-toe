import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

// Custom plugin to ensure correct paths for GitHub Pages
const ghPagesPlugin = () => {
  return {
    name: 'gh-pages-plugin',
    
    // After build, ensure all assets are properly linked
    closeBundle() {
      // Copy logo to dist root
      try {
        fs.copyFileSync(
          resolve('./public/tic-tac-toe-logo.svg'),
          resolve('./dist/tic-tac-toe-logo.svg')
        )
        console.log('✅ Logo copied to dist root')
      } catch (err) {
        console.error('❌ Error copying logo:', err)
      }
      
      // Create .nojekyll file
      try {
        fs.writeFileSync(resolve('./dist/.nojekyll'), '')
        console.log('✅ Created .nojekyll file')
      } catch (err) {
        console.error('❌ Error creating .nojekyll file:', err)
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ghPagesPlugin()
  ],
  base: '/tic-tac-toe/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
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
