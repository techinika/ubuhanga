# Ubuhanga — Tech Tutorials mu Kinyarwanda

Ubuhanga ni urubuga rw'uburezi rwa kubuntu rutanga amasomo y'ubumenyingiro mu ikoranabuhanga mu rurimi rw'Ikinyarwanda.

A free, open learning platform delivering tech tutorials in **Kinyarwanda**. A product of [Techinika](https://techinika.co.rw).

## Stack

- **Framework:** [Astro](https://astro.build) v6 (SSR — `output: "server"`)
- **Adapter:** `@astrojs/vercel`
- **PWA:** `@vite-pwa/astro` — manifest + Workbox service worker, install button on mobile bottom nav / desktop footer
- **Auth:** Firebase Auth (Google sign-in for admin panel + comments), session cookies via Firebase Admin SDK
- **Database:** Firebase Firestore (videos, playlists, categories, comments, subscribers, auditLog)
- **Ads:** Google AdSense (`ca-pub-1268572467254702`)
- **Styling:** CSS custom properties with light/dark theme toggle (persisted to localStorage)
- **Fonts:** Lexend (display) + Inter (body) via @fontsource (self-hosted)
- **Linting & Formatting:** ESLint (flat config) + Prettier with `prettier-plugin-astro`
- **Security:** CSP with nonces, rate limiting, security headers via middleware

## Routes

| Path | Description |
|---|---|
| `/` | Homepage — hero, featured videos, playlists, newsletter |
| `/videos` | All videos with client-side category filter |
| `/videos/[slug]` | Single video — YouTube embed, comments, related sidebar, view counter |
| `/playlists` | All curated playlists |
| `/playlists/[slug]` | Single playlist — ordered video list with duration |
| `/search` | Client-side search across all video fields |
| `/about` | About Ubuhanga and Techinika |
| `/terms` | Terms of Service |
| `/privacy` | Privacy Policy |
| `/admin` | Admin sign-in with Google |
| `/admin/videos` | Manage videos (list, create, edit, delete) — paginated |
| `/admin/playlists` | Manage playlists (list, create, edit, delete) — paginated |
| `/admin/categories` | Manage categories |
| `/admin/comments` | Moderate comments (approve / reject) |
| `/rss.xml` | RSS feed of all videos |
| `/sitemap.xml` | Dynamic sitemap (static pages + videos + playlists) |

## Project structure

```
src/
├── components/
│   ├── CategoryPill.astro       # Filter pill (button or link)
│   ├── CommentSection.astro     # Google Auth + comment CRUD
│   ├── EmptyState.astro         # Reusable empty state with icon
│   ├── ErrorPage.astro          # Shared 404/500 layout
│   ├── GoogleAd.astro           # AdSense unit wrapper
│   ├── NewsletterForm.astro     # Submits to /api/newsletter
│   ├── PlaylistCard.astro
│   └── VideoCard.astro
├── layouts/
│   ├── AdminLayout.astro        # Admin shell with sidebar nav and auth
│   └── BaseLayout.astro         # SEO head, OG, schema.org, nav, bottom nav (mobile), footer, theme toggle, PWA install button
├── lib/
│   ├── admin-auth.ts            # Server-side admin session verification
│   ├── category-filter.ts       # Shared JS for category pill filtering
│   ├── constants.ts             # SITE_NAME, SITE_URL, COLLECTIONS
│   ├── env.ts                   # Environment variable validation
│   ├── firebase-admin.ts        # Firebase Admin SDK singleton
│   ├── firebase-client.ts       # Singleton Firebase client (auth + firestore)
│   ├── firestore.ts             # Server-side Firebase Admin helpers + types
│   ├── helpers.ts               # escapeHtml shared utility
│   └── index.ts                 # Barrel file for all firestore exports
├── middleware.ts                # CSP, rate limiting, security headers, admin auth
├── pages/
│   ├── index.astro
│   ├── 404.astro
│   ├── 500.astro
│   ├── about.astro
│   ├── terms.astro
│   ├── privacy.astro
│   ├── search.astro
│   ├── rss.xml.ts
│   ├── sitemap.xml.ts
│   ├── api/
│   │   ├── admin/session.ts     # Session cookie create/delete endpoint
│   │   └── newsletter.ts        # Server-side newsletter subscription
│   ├── admin/
│   │   ├── index.astro          # Sign-in page
│   │   ├── videos/
│   │   │   ├── index.astro      # Video list (paginated)
│   │   │   ├── new.astro        # Create video
│   │   │   └── [id].astro       # Edit video
│   │   ├── playlists/
│   │   │   ├── index.astro      # Playlist list (paginated)
│   │   │   ├── new.astro        # Create playlist
│   │   │   └── [id].astro       # Edit playlist
│   │   ├── categories/
│   │   │   └── index.astro      # Manage categories
│   │   └── comments/
│   │       └── index.astro      # Moderate comments
│   ├── videos/
│   │   ├── index.astro
│   │   └── [slug].astro
│   └── playlists/
│       ├── index.astro
│       └── [slug].astro
├── env.d.ts                     # App.Locals type declarations
└── styles/
    └── globals.css              # Design tokens, CSS reset, light/dark modes, buttons
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

```
# Firebase Client SDK (browser-safe, PUBLIC_ prefix)
PUBLIC_FIREBASE_API_KEY=
PUBLIC_FIREBASE_AUTH_DOMAIN=
PUBLIC_FIREBASE_PROJECT_ID=
PUBLIC_FIREBASE_STORAGE_BUCKET=
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
PUBLIC_FIREBASE_APP_ID=

# Google AdSense
PUBLIC_ADSENSE_ID=ca-pub-xxxxxxxxxxxxxxxx

# Firebase Admin SDK (server-only, no PUBLIC_ prefix)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Commands

| Command | Action |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Type-check then build for production |
| `npm run preview` | Preview production build locally |
| `npm run check` | Run `astro check` only |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## Admin access

1. Navigate to `/admin`
2. Sign in with a Google account
3. The account's UID must exist as a document in the `admins` Firestore collection
4. Once authorized, a session cookie is created and you are redirected to `/admin/videos`
5. Use the sidebar to navigate between videos, playlists, categories, and comments

## Firestore collections

| Collection | Purpose |
|---|---|
| `videos` | Video metadata (title, description, youtubeId, duration, views, category, slug, tags) |
| `playlists` | Curated groupings of videos |
| `categories` | Distinct category labels |
| `comments` | User comments on videos (tied to Google Auth UID, status: pending/approved/rejected) |
| `subscribers` | Newsletter email subscriptions |
| `admins` | Documents keyed by UID; presence grants admin panel access |
| `auditLog` | Admin action audit trail |

## Security

- **Content Security Policy:** Restricts scripts, styles, frames, connections, and fonts to trusted origins (self, YouTube, Firebase, Google AdSense)
- **Rate Limiting:** In-memory IP-based: 100 req/60s general API, 10 req/60s admin
- **Caching:** HTML 600s, static assets immutable, admin pages no-cache (via `vercel.json`)
- **Admin Auth:** Session cookies verified on every `/admin` page and `/api/admin/*` request
