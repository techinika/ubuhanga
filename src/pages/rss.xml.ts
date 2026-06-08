import type { APIRoute } from "astro";
import { SITE_URL } from "@/lib/constants";
import { getAllVideos } from "@/lib/firestore";

export const GET: APIRoute = async () => {
  const site = SITE_URL;
  const videos = await getAllVideos();

  const items = videos.map(
    (v) => `    <item>
      <title><![CDATA[${v.title}]]></title>
      <description><![CDATA[${v.description}]]></description>
      <link>${site}/videos/${v.slug}</link>
      <guid>${site}/videos/${v.slug}</guid>
      <pubDate>${v.publishedAt ? new Date(v.publishedAt).toUTCString() : new Date().toUTCString()}</pubDate>
      <category>${v.category}</category>
      <enclosure url="https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg" type="image/jpeg" />
    </item>`,
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Ubuhanga — Tech Tutorial Archive</title>
    <description>Free programming tutorials covering React, Node.js, Python, DevOps, databases, and more.</description>
    <link>${site}</link>
    <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml" />
    <language>rw</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items.join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
};
