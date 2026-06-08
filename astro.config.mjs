// @ts-check
import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel";

export default defineConfig({
  output: "server",
  adapter: vercel(),

  site: "https://ubuhanga.techinika.com",

  integrations: [],

  vite: {
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname,
      },
    },
    define: {},
    ssr: {
      external: ["firebase-admin"],
      noExternal: ["firebase", "@fontsource/inter", "@fontsource/lexend"],
    },
    optimizeDeps: {
      exclude: ["firebase-admin"],
    },
  },
});
