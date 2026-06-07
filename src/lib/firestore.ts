// src/lib/firestore.ts
// Server-side Firestore helpers for Astro SSR/SSG data fetching
// Used in page frontmatter (not in the browser)

import {
  initializeApp,
  getApps,
  cert,
  type ServiceAccount,
} from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

// ─── Initialize Firebase Admin (once) ────────────────────
function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];

  return initializeApp({
    credential: cert({
      projectId: import.meta.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: import.meta.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // Replace escaped newlines in env var
      privateKey: import.meta.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n",
      ),
    } as ServiceAccount),
  });
}

function getDB() {
  getAdminApp();
  return getFirestore();
}

// ─── Types ────────────────────────────────────────────────
export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnail: string;
  duration: string;
  views: string;
  category: string;
  publishedAt: string; // ISO string
  slug: string;
  playlistId?: string;
  tags?: string[];
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoCount: number;
  slug: string;
  tags: string[];
  youtubePlaylistId?: string;
}

export interface Subscriber {
  name: string;
  email: string;
  subscribedAt: Timestamp;
  source: string;
}

// ─── Helpers ──────────────────────────────────────────────
function timestampToISO(value: Timestamp | string | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.toDate().toISOString();
}

// ─── Videos ───────────────────────────────────────────────

/** Fetch latest N videos, optionally filtered by category */
export async function getFeaturedVideos(
  limit = 6,
  category?: string,
): Promise<Video[]> {
  const db = getDB();
  let q = db.collection("videos").orderBy("publishedAt", "desc").limit(limit);
  if (category && category !== "All") {
    q = q.where("category", "==", category) as typeof q;
  }
  const snap = await q.get();
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    publishedAt: timestampToISO(doc.data().publishedAt),
  })) as Video[];
}

/** Fetch a single video by slug */
export async function getVideoBySlug(slug: string): Promise<Video | null> {
  const db = getDB();
  const snap = await db
    .collection("videos")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
    publishedAt: timestampToISO(doc.data().publishedAt),
  } as Video;
}

/** Fetch all video slugs (for static path generation) */
export async function getAllVideoSlugs(): Promise<string[]> {
  const db = getDB();
  const snap = await db.collection("videos").select("slug").get();
  return snap.docs.map((d) => d.data().slug as string);
}

/** Fetch videos belonging to a playlist */
export async function getVideosByPlaylist(
  playlistId: string,
): Promise<Video[]> {
  const db = getDB();
  const snap = await db
    .collection("videos")
    .where("playlistId", "==", playlistId)
    .orderBy("publishedAt", "asc")
    .get();
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    publishedAt: timestampToISO(doc.data().publishedAt),
  })) as Video[];
}

// ─── Playlists ────────────────────────────────────────────

/** Fetch all playlists */
export async function getPlaylists(limit = 20): Promise<Playlist[]> {
  const db = getDB();
  const snap = await db
    .collection("playlists")
    .orderBy("title")
    .limit(limit)
    .get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Playlist[];
}

/** Fetch a single playlist by slug */
export async function getPlaylistBySlug(
  slug: string,
): Promise<Playlist | null> {
  const db = getDB();
  const snap = await db
    .collection("playlists")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as Playlist;
}

/** Fetch all playlist slugs */
export async function getAllPlaylistSlugs(): Promise<string[]> {
  const db = getDB();
  const snap = await db.collection("playlists").select("slug").get();
  return snap.docs.map((d) => d.data().slug as string);
}

// ─── Categories ───────────────────────────────────────────

/** Get distinct category values from videos */
export async function getCategories(): Promise<string[]> {
  const db = getDB();
  const snap = await db.collection("videos").select("category").get();
  const cats = [
    ...new Set(snap.docs.map((d) => d.data().category as string)),
  ].sort();
  return ["All", ...cats];
}

// ─── Stats ───────────────────────────────────────────────

export async function getSiteStats(): Promise<{
  totalVideos: number;
  totalPlaylists: number;
}> {
  const db = getDB();
  const [videos, playlists] = await Promise.all([
    db.collection("videos").count().get(),
    db.collection("playlists").count().get(),
  ]);
  return {
    totalVideos: videos.data().count,
    totalPlaylists: playlists.data().count,
  };
}
