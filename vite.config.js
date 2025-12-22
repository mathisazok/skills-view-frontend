import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer les vendors pour un meilleur caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'axios-vendor': ['axios'],
        },
      },
    },
    // Augmenter la limite avant warning pour les gros chunks
    chunkSizeWarningLimit: 1000,
    // Optimisations supplémentaires
    sourcemap: false, // Désactiver sourcemaps en production pour réduire la taille
    minify: 'esbuild', // Utiliser esbuild pour une minification rapide
  },
})
