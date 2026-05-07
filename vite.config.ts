import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// When deploying to GitHub Pages WITHOUT a custom domain, your site will live at
// https://<username>.github.io/<repo-name>/  — Vite needs to know that subpath.
// When deploying WITH a custom domain (vire.fun, etc.), the site lives at the root.
//
// The build script reads the env var GH_PAGES_BASE. Examples:
//   • Custom domain:        npm run build         (no env var, base = '/')
//   • Subpath on github.io: GH_PAGES_BASE=vire npm run build  (base = '/vire/')
//
// On Windows PowerShell:  $env:GH_PAGES_BASE='vire'; npm run build

const repoBase = process.env.GH_PAGES_BASE;

export default defineConfig({
  plugins: [react()],
  base: repoBase ? `/${repoBase}/` : '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Split three.js out so the initial JS payload stays small
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
        },
      },
    },
  },
  server: { port: 5173 },
});
