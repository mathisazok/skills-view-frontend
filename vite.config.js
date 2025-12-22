import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Configuration serveur de développement
  server: {
    port: 5173,
    open: true,
  },

  // Configuration pour la production
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Désactiver les sourcemaps en production pour réduire la taille
    minify: 'esbuild', // Minification avec esbuild (plus rapide et inclus par défaut)
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer les vendor chunks pour un meilleur caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Limite de taille des chunks (en KB)
  },

  // Base URL - modifier si l'app est dans un sous-dossier
  // Exemple: si votre site est sur monsite.com/app/, utilisez base: '/app/'
  base: '/',

  // Optimisation des dépendances
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
