import { defineConfig } from "astro/config";

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

import behead from "remark-behead";

// https://astro.build/config
export default defineConfig({
  site: 'https://omranjamal.me',
  integrations: [
    tailwind({
      config: { applyBaseStyles: false },
    }),
    mdx(),
    react(),
    prefetch(),
    sitemap({
      filter: (page) => !page.includes('draft-')
    }),
  ],
  markdown: {
    remarkPlugins: [[behead, { minDepth: 2 }]],
    gfm: true,
    shikiConfig: {
      theme: "rose-pine-moon",
    },
  },
});
