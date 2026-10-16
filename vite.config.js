import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    target: 'es2022',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        impressum: resolve(import.meta.dirname, 'impressum.html'),
        datenschutz: resolve(import.meta.dirname, 'datenschutz.html'),
      },
      output: {
        manualChunks: { three: ['three'], motion: ['gsap', 'lenis'] },
      },
    },
    chunkSizeWarningLimit: 700,
  },
});
