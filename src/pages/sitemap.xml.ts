import type { APIRoute } from "astro";
import { SITE_URL } from "@/lib/constants";
import { getAllVideos, getAllPlaylistSlugs } from "@/lib/firestore";

function escXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const PRIORITIES = {
  home: "1.0",
  videos: "0.9",
  playlists: "0.9",
  about: "0.7",
  video: "0.8",
  playlist: "0.7",
  search: "0.5",
} as const;

interface UrlEntry {
  loc: string;
  priority: string;
  lastmod?: string;
}

export const GET: APIRoute = async () => {
  const site = SITE_URL;

  const staticPages: UrlEntry[] = [
    { loc: "/", priority: PRIORITIES.home },
    { loc: "/videos", priority: PRIORITIES.videos },
    { loc: "/playlists", priority: PRIORITIES.playlists },
    { loc: "/about", priority: PRIORITIES.about },
    { loc: "/search", priority: PRIORITIES.search },
  ];

  const [videos, playlistSlugs] = await Promise.all([getAllVideos(), getAllPlaylistSlugs()]);

  const urls: UrlEntry[] = [
    ...staticPages,
    ...videos.map((v) => ({
      loc: `/videos/${v.slug}`,
      priority: PRIORITIES.video,
      lastmod: v.publishedAt?.slice(0, 10),
    })),
    ...playlistSlugs.map((slug) => ({
      loc: `/playlists/${slug}`,
      priority: PRIORITIES.playlist,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${site}${escXml(u.loc)}</loc>
    <priority>${u.priority}</priority>
    <changefreq>weekly</changefreq>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
};
