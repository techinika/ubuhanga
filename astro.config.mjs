// @ts-check
import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel";

export default defineConfig({
  output: "server",
  adapter: vercel(),

  site: "https://ubuhanga.dev",

  integrations: [],

  vite: {
    define: {},
    ssr: {
      external: ["firebase-admin"],
      noExternal: ["firebase"],
    },
    optimizeDeps: {
      exclude: ["firebase-admin"],
    },
  },
});
