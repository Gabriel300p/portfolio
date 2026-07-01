// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://gabrielandrade.com",
  // Static output — this is a content portfolio, no server runtime needed.
  output: "static",
  integrations: [sitemap()],
  build: {
    inlineStylesheets: "auto",
  },
});
