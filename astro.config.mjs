// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

import UnoCSS from 'unocss/astro';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  integrations: [
    UnoCSS({
      injectReset: true,
    })
  ],
});