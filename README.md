# Ubuhanga — Tech Tutorials mu Kinyarwanda

Ubuhanga ni urubuga rw'uburezi rwa kubuntu rutanga amasomo y'ubumenyingiro mu ikoranabuhanga mu rurimi rw'Ikinyarwanda.

A free, open learning platform delivering tech tutorials in **Kinyarwanda**. A product of [Techinika](https://techinika.co.rw).

## Stack

- **Framework:** [Astro](https://astro.build) v6 (SSR — `output: "server"`)
- **Adapter:** `@astrojs/vercel`
- **Auth:** Firebase Auth (Google sign-in for admin panel + comments), session cookies via Firebase Admin SDK
- **Database:** Firebase Firestore (videos, playlists, categories, comments, subscribers)
- **Ads:** Google AdSense (`ca-pub-1268572467254702`)
- **Styling:** CSS custom properties with light/dark theme toggle (persisted to localStorage)
- **Fonts:** Lexend (display) + Inter (body) via Google Fonts

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
| `/admin` | Admin sign-in with Google |
| `/admin/videos` | Manage videos (list, create, edit, delete) |
| `/admin/playlists` | Manage playlists (list, create, edit, delete) |
| `/admin/categories` | Manage categories |
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
│   ├── NewsletterForm.astro     # Firestore subscription form
│   ├── PlaylistCard.astro
│   └── VideoCard.astro
├── layouts/
│   ├── AdminLayout.astro        # Admin shell with sidebar nav and auth
│   └── BaseLayout.astro         # SEO head, OG, schema.org, nav, footer, theme toggle
├── lib/
│   ├── admin-auth.ts            # Server-side admin session verification
│   ├── category-filter.ts       # Shared JS for category pill filtering
│   ├── firebase-client.ts       # Singleton Firebase client (auth + firestore)
│   ├── firestore.ts             # Server-side Firebase Admin helpers
│   └── helpers.ts               # escapeHtml shared utility
├── middleware.ts                # Auth middleware protecting /admin routes
├── pages/
│   ├── index.astro
│   ├── 404.astro
│   ├── 500.astro
│   ├── about.astro
│   ├── search.astro
│   ├── rss.xml.ts
│   ├── sitemap.xml.ts
│   ├── api/admin/session.ts     # Session cookie create/delete endpoint
│   ├── admin/
│   │   ├── index.astro          # Sign-in page
│   │   ├── videos/
│   │   │   ├── index.astro      # Video list
│   │   │   ├── new.astro        # Create video
│   │   │   └── [id].astro       # Edit video
│   │   ├── playlists/
│   │   │   ├── index.astro      # Playlist list
│   │   │   ├── new.astro        # Create playlist
│   │   │   └── [id].astro       # Edit playlist
│   │   └── categories/
│   │       └── index.astro      # Manage categories
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
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start local dev server at `localhost:4321` |
| `pnpm build` | Build for production (Vercel SSR output) |
| `pnpm preview` | Preview production build locally |
| `pnpm tsc --noEmit` | TypeScript type check |

## Admin access

1. Navigate to `/admin`
2. Sign in with a Google account
3. The account's UID must exist as a document in the `admins` Firestore collection
4. Once authorized, a session cookie is created and you are redirected to `/admin/videos`
5. Use the sidebar to navigate between videos, playlists, and categories management

## Firestore collections

| Collection | Purpose |
|---|---|
| `videos` | Video metadata (title, description, youtubeId, duration, views, category, slug, tags) |
| `playlists` | Curated groupings of videos |
| `categories` | Distinct category labels |
| `comments` | User comments on videos (tied to Google Auth UID) |
| `subscribers` | Newsletter email subscriptions |
| `admins` | Documents keyed by UID; presence grants admin panel access |
