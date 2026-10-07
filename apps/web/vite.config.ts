import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Nurture web app — frontend-only concept demo.
// There is intentionally no API proxy yet: no backend, no AI keys, no health-data access.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: false,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
