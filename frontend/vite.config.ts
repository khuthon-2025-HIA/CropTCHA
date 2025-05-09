import { resolve } from 'node:path';
import { defineConfig } from 'vite';

import solid from 'vite-plugin-solid';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  plugins: [
    solid(),
    vanillaExtractPlugin(),
  ],
  resolve: {
    alias: [
      { find: /^@\//, replacement: `${resolve(__dirname, 'src')}/` },
    ],
  },
});
