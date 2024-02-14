import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import mdx from "@astrojs/mdx";

// https://astro.build/config
import react from "@astrojs/react";

// https://astro.build/config
import behead from "remark-behead";

// https://astro.build/config
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  site: "https://omranjamal.me",
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    expressiveCode({
      themes: ["rose-pine-moon"],
      styleOverrides: {
        codeFontSize: "1.05rem",
        borderRadius: "0.6rem",
        frames: {
          shadowColor: "transparent",
        },
      },
    }),
    mdx(),
    react(),
  ],
  markdown: {
    remarkPlugins: [
      [
        behead,
        {
          minDepth: 2,
        },
      ],
    ],
    gfm: true,
    shikiConfig: {
      theme: "rose-pine-moon",
    },
  },
  output: "server",
  adapter: cloudflare(),
  prefetch: true,
});
