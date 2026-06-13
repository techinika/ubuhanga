// @ts-check
import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel";
import AstroPWA from "@vite-pwa/astro";

export default defineConfig({
  output: "server",
  adapter: vercel(),

  site: "https://ubuhanga.techinika.com",

  integrations: [
    AstroPWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Ubuhanga",
        short_name: "Ubuhanga",
        description: "Free programming and tech tutorials in Kinyarwanda",
        theme_color: "#b45309",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "any",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,svg,png,woff2,ico}"],
        globIgnores: ["**/admin/**"],
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],

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
