// src/lib/firestore.ts
// Server-side Firestore helpers for Astro SSR/SSG data fetching
// Used in page frontmatter (not in the browser)

import { getAdminApp } from "./firebase-admin";
import { getFirestore, type Timestamp } from "firebase-admin/firestore";
import { COLLECTIONS } from "./constants";

export function getDB() {
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
  views: number;
  category: string;
  publishedAt: string;
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
export async function getFeaturedVideos(limit = 6, category?: string): Promise<Video[]> {
  const db = getDB();
  if (category && category !== "All") {
    const snap = await db
      .collection(COLLECTIONS.VIDEOS)
      .where("category", "==", category)
      .orderBy("publishedAt", "desc")
      .limit(limit)
      .get();
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: timestampToISO(doc.data().publishedAt),
    })) as Video[];
  }
  const snap = await db
    .collection(COLLECTIONS.VIDEOS)
    .orderBy("publishedAt", "desc")
    .limit(limit)
    .get();
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    publishedAt: timestampToISO(doc.data().publishedAt),
  })) as Video[];
}

/** Fetch a single video by slug */
export async function getVideoBySlug(slug: string): Promise<Video | null> {
  const db = getDB();
  const snap = await db.collection(COLLECTIONS.VIDEOS).where("slug", "==", slug).limit(1).get();
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
  const snap = await db.collection(COLLECTIONS.VIDEOS).select("slug").get();
  return snap.docs.map((d) => d.data().slug as string);
}

/** Fetch videos belonging to a playlist */
export async function getVideosByPlaylist(playlistId: string): Promise<Video[]> {
  const db = getDB();
  const snap = await db
    .collection(COLLECTIONS.VIDEOS)
    .where("playlistId", "==", playlistId)
    .get();
  const videos = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    publishedAt: timestampToISO(doc.data().publishedAt),
  })) as Video[];
  return videos.sort(
    (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime(),
  );
}

// ─── Playlists ────────────────────────────────────────────

/** Fetch all playlists */
export async function getPlaylists(limit = 20): Promise<Playlist[]> {
  const db = getDB();
  const snap = await db.collection(COLLECTIONS.PLAYLISTS).orderBy("title").limit(limit).get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Playlist[];
}

/** Fetch a single playlist by slug */
export async function getPlaylistBySlug(slug: string): Promise<Playlist | null> {
  const db = getDB();
  const snap = await db.collection(COLLECTIONS.PLAYLISTS).where("slug", "==", slug).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as Playlist;
}

/** Fetch all playlist slugs */
export async function getAllPlaylistSlugs(): Promise<string[]> {
  const db = getDB();
  const snap = await db.collection(COLLECTIONS.PLAYLISTS).select("slug").get();
  return snap.docs.map((d) => d.data().slug as string);
}

// ─── Categories ───────────────────────────────────────────

/** Get distinct category values from videos */
export async function getCategories(): Promise<string[]> {
  const db = getDB();
  const snap = await db.collection(COLLECTIONS.CATEGORIES).orderBy("name").get();
  if (!snap.empty) {
    const cats = snap.docs.map((d) => d.data().name as string);
    return ["All", ...cats];
  }
  const vSnap = await db.collection(COLLECTIONS.VIDEOS).select("category").limit(500).get();
  const cats = [...new Set(vSnap.docs.map((d) => d.data().category as string))].sort();
  return ["All", ...cats];
}

/** Fetch all videos (for search & browse pages) */
export async function getAllVideos(): Promise<Video[]> {
  const db = getDB();
  const snap = await db.collection(COLLECTIONS.VIDEOS).orderBy("publishedAt", "desc").get();
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    publishedAt: timestampToISO(doc.data().publishedAt),
  })) as Video[];
}

/** Fetch a playlist by its document ID */
export async function getPlaylistById(playlistId: string): Promise<Playlist | null> {
  const db = getDB();
  const snap = await db.collection(COLLECTIONS.PLAYLISTS).doc(playlistId).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() } as Playlist;
}

// ─── Pagination ─────────────────────────────────────────

interface PageInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

interface PaginatedResult<T> {
  items: T[];
  pageInfo: PageInfo;
}

const PAGE_SIZE = 25;

export async function getPaginatedVideos(
  page = 1,
  pageSize = PAGE_SIZE,
): Promise<PaginatedResult<Video>> {
  const db = getDB();
  const offset = (page - 1) * pageSize;
  const [totalSnap, snap] = await Promise.all([
    db.collection(COLLECTIONS.VIDEOS).count().get(),
    db
      .collection(COLLECTIONS.VIDEOS)
      .orderBy("publishedAt", "desc")
      .offset(offset)
      .limit(pageSize)
      .get(),
  ]);
  const total = totalSnap.data().count;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return {
    items: snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: timestampToISO(doc.data().publishedAt),
    })) as Video[],
    pageInfo: {
      page,
      pageSize,
      total,
      totalPages,
      hasPrev: page > 1,
      hasNext: page < totalPages,
    },
  };
}

export async function getPaginatedPlaylists(
  page = 1,
  pageSize = PAGE_SIZE,
): Promise<PaginatedResult<Playlist>> {
  const db = getDB();
  const offset = (page - 1) * pageSize;
  const [totalSnap, snap] = await Promise.all([
    db.collection(COLLECTIONS.PLAYLISTS).count().get(),
    db
      .collection(COLLECTIONS.PLAYLISTS)
      .orderBy("title")
      .offset(offset)
      .limit(pageSize)
      .get(),
  ]);
  const total = totalSnap.data().count;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return {
    items: snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Playlist[],
    pageInfo: {
      page,
      pageSize,
      total,
      totalPages,
      hasPrev: page > 1,
      hasNext: page < totalPages,
    },
  };
}

// ─── Comments ────────────────────────────────────────────

export interface Comment {
  id: string;
  videoId: string;
  videoTitle?: string;
  authorName: string;
  authorPhoto?: string;
  text: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

export async function getCommentsForModeration(
  status?: "pending" | "approved" | "rejected",
): Promise<Comment[]> {
  const db = getDB();
  let q: FirebaseFirestore.Query = db.collection(COLLECTIONS.COMMENTS);
  if (status) {
    q = q.where("status", "==", status);
  }
  q = q.orderBy("createdAt", "desc").limit(100);
  const snap = await q.get();
  return snap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      ...d,
      createdAt: timestampToISO(d.createdAt),
    } as Comment;
  });
}

export async function getCommentStatusCounts(): Promise<{
  pending: number;
  approved: number;
  rejected: number;
}> {
  const db = getDB();
  const [pending, approved, rejected] = await Promise.all([
    db.collection(COLLECTIONS.COMMENTS).where("status", "==", "pending").count().get(),
    db.collection(COLLECTIONS.COMMENTS).where("status", "==", "approved").count().get(),
    db.collection(COLLECTIONS.COMMENTS).where("status", "==", "rejected").count().get(),
  ]);
  return {
    pending: pending.data().count,
    approved: approved.data().count,
    rejected: rejected.data().count,
  };
}

// ─── Audit Log ──────────────────────────────────────────

export async function writeAuditLog(entry: {
  action: string;
  adminEmail: string;
  targetId?: string;
  targetType?: string;
  details?: string;
}): Promise<void> {
  const db = getDB();
  await db.collection(COLLECTIONS.AUDIT_LOG).add({
    ...entry,
    createdAt: new Date(),
  });
}

// ─── Stats ───────────────────────────────────────────────

function parseDurationToSeconds(duration: string): number {
  const parts = duration.split(":");
  if (parts.length === 3) {
    return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
  }
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return 0;
}

export async function getSiteStats(): Promise<{
  totalVideos: number;
  totalPlaylists: number;
  totalHours: number;
}> {
  const db = getDB();
  const [videos, playlists, durationDocs] = await Promise.all([
    db.collection(COLLECTIONS.VIDEOS).count().get(),
    db.collection(COLLECTIONS.PLAYLISTS).count().get(),
    db.collection(COLLECTIONS.VIDEOS).select("duration").get(),
  ]);
  let totalSeconds = 0;
  for (const doc of durationDocs.docs) {
    const d = doc.data().duration;
    if (typeof d === "string") {
      totalSeconds += parseDurationToSeconds(d);
    }
  }
  return {
    totalVideos: videos.data().count,
    totalPlaylists: playlists.data().count,
    totalHours: Math.round(totalSeconds / 3600),
  };
}
