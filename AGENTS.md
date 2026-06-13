# OpenCode Agent Instructions

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Type-check then build for production
- `npm run preview` — Preview production build
- `npm run check` — Run `astro check` only
- `npm run lint` — Run ESLint
- `npm run format` — Format with Prettier

## Conventions
- Astro v6 SSR with Vercel adapter, `output: "server"`
- Path aliases: `@/` maps to `src/`
- TypeScript strict mode
- Firebase Admin for server data fetching, Firebase Client for browser auth/Firestore
- Self-hosted fonts via @fontsource (Inter + Lexend)
- CSS custom properties with light/dark theme
- Collections as constants in `@/lib/constants.ts`
- Environment variables use `import.meta.env` (NOT `process.env`) via `validateEnv()` in `@/lib/env.ts`
- Comment moderation uses `status` field (`"pending"`/`"approved"`/`"rejected"`), not a boolean
- CSP in `src/middleware.ts` covers Firebase Auth, Google Sign-In, AdSense, GA4, YouTube embeds
- PWA via `@vite-pwa/astro` configured in `astro.config.mjs` — manifest uses SVG icon, Workbox precaches static assets, skips admin routes
- Mobile bottom nav (`.bottom-nav`, `<768px`) has Videos, Playlists, Support, Install — hidden on desktop
- Install button (`.install-btn--hidden` class) starts hidden, shown on `beforeinstallprompt` event, hidden after `appinstalled`
- Categories bar (`.categories-bar__scroll`) uses `overflow-x: auto` with full-bleed negative margins on mobile for horizontal touch scroll

## Project Structure
```
src/
  components/     — Astro components (VideoCard, CommentSection, etc.)
  layouts/        — BaseLayout.astro, AdminLayout.astro
  lib/            — Utilities, helpers, Firebase config, constants, barrel exports
  pages/          — Astro pages (SSR) including admin comments, API routes, terms/privacy
  middleware.ts   — CSP, rate limiting, security headers, admin auth guard
  styles/         — globals.css (design tokens, theme)
public/           — Static assets
```

## Config Files
- `eslint.config.js` — Flat config with `eslint-plugin-astro` + `typescript-eslint`
- `.prettierrc` — Prettier with `prettier-plugin-astro`
- `vercel.json` — Static security headers, caching, Vercel Analytics

## API Routes
- `POST /api/newsletter` — Server-side newsletter subscription (validates name + email, checks duplicates)
- `POST/DELETE /api/admin/session` — Admin session cookie management

## Admin Pages
- `/admin/videos` — Paginated video list (25 per page)
- `/admin/playlists` — Paginated playlist list (25 per page)
- `/admin/categories` — Category CRUD
- `/admin/comments` — Comment moderation (approve/reject with status tabs)

## Import Template
```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import { SITE_NAME, SITE_URL, COLLECTIONS } from '@/lib/constants';
---
```
