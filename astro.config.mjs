// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://gabrielandrade.com",
  // Static output — this is a content portfolio, no server runtime needed.
  output: "static",
  build: {
    inlineStylesheets: "auto",
  },
});
