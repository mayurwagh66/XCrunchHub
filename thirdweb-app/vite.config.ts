import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import rollupNodePolyfills from 'rollup-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    // Removed all explicit Buffer definitions to prevent conflicts
    // Relying solely on rollup-plugin-node-polyfills and Vite's defaults
  },
  resolve: {
    alias: {
      // This Rollup polyfill is required for lottie-react
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6'
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
        // Removed all explicit Buffer definitions from here too
      },
      plugins: [
        // Removed NodeGlobalsPolyfillPlugin and NodeModulesPolyfillPlugin from here
      ]
    }
  },
  build: {
    rollupOptions: {
      plugins: [
        rollupNodePolyfills()
      ]
    }
  },
  server: {
    proxy: {
      '/api-anchain': {
        target: 'https://demo.anchainai.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-anchain/, ''),
      },
      '/api-goplus': {
        target: 'https://api.gopluslabs.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-goplus/, '/api/v1'), // Changed rewrite rule
      },
    },
  },
});
