
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

/**
 * Vite Configuration
 * 
 * This configuration sets up the build system for the Notion Notification Center.
 * It includes React support, development server settings, and build optimizations.
 */
export default defineConfig({
  plugins: [
    react(),
    // Custom plugin to copy legal.html to dist folder
    {
      name: 'copy-legal',
      writeBundle() {
        try {
          copyFileSync(
            resolve(__dirname, 'legal.html'),
            resolve(__dirname, 'dist/legal.html')
          )
        } catch (error) {
          console.warn('Could not copy legal.html:', error.message)
        }
      }
    }
  ],
  
  // Development server configuration
  server: {
    port: 5173,
    host: true, // Allow external connections
    open: false // Don't auto-open browser
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps for production
    minify: 'esbuild', // Use esbuild for faster minification
    rollupOptions: {
      output: {
        // Ensure consistent chunk naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  
  // Public directory for static assets
  publicDir: 'public',
  
  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
  }
})
