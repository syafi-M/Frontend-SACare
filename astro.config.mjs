// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

import UnoCSS from 'unocss/astro';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    UnoCSS({
      injectReset: true,
    })
  ],
});