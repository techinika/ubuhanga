// @ts-check
import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel";

export default defineConfig({
  // Set to 'server' if using SSR (dynamic pages, real-time Firestore reads)
  // Set to 'static' for fully static (pre-built at build time)
  output: "server",
  adapter: vercel(),

  // Site URL — used for canonical URLs and sitemap generation
  site: "https://ubuhanga.dev", // ← change to your domain

  // Integrations — add as needed:
  // import sitemap from '@astrojs/sitemap';
  // import compress from 'astro-compress';
  // integrations: [sitemap()],

  // Vite config for env vars & optimizations
  vite: {
    define: {
      // Expose PUBLIC_ vars to the client
    },
    ssr: {
      // firebase-admin uses Node.js APIs — keep it server-side only
      external: ["firebase-admin"],
      noExternal: ["firebase"],
    },
    optimizeDeps: {
      exclude: ["firebase-admin"],
    },
  },
});
