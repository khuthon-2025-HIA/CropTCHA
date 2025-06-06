import { resolve } from 'node:path';
import { defineConfig } from 'vite';

import solid from 'vite-plugin-solid';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  plugins: [
    solid(),
    vanillaExtractPlugin(),
  ],
  server: {
    allowedHosts: [
      'dev1.suyong.me',
      'dev2.suyong.me',
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  },
  resolve: {
    alias: [
      { find: /^@\//, replacement: `${resolve(__dirname, 'src')}/` },
    ],
  },
});
