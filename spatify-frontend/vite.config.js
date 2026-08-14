import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: Number(process.env.VITE_PORT || 8126),
    strictPort: false,
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.VITE_PREVIEW_PORT || 4173),
    strictPort: false,
  },
});
