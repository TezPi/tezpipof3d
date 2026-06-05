import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:       resolve(__dirname, 'index.html'),
        experience: resolve(__dirname, 'experience.html'),
        gallery:    resolve(__dirname, 'gallery.html'),
        project:    resolve(__dirname, 'project.html'),
      },
    },
  },
});
