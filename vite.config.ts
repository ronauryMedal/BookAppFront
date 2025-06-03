import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    fs: {
      strict: false
    }
  },
  optimizeDeps: {
    include: ['@angular/core', '@angular/platform-browser', '@angular/router', 'zone.js'],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  build: {
    target: 'es2020',
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  }
}); 