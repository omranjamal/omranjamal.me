import { defineConfig } from 'astro/config';

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
import react from "@astrojs/react";

// https://astro.build/config
import prefetch from "@astrojs/prefetch";

// https://astro.build/config
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind({
    config: { applyBaseStyles: false }
  }), mdx(), react(), prefetch(), sitemap()],
  markdown: {
    gfm: true,
    shikiConfig: {
      theme: 'rose-pine-moon',
    }
  }
});