import { defineMiddleware } from "astro/middleware";
import { verifyAdminSession } from "@/lib/admin-auth";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string, maxReqs = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count++;
  return entry.count <= maxReqs;
}

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://apis.google.com https://pagead2.googlesyndication.com https://www.youtube.com https://www.googletagmanager.com https://ep2.adtrafficquality.google",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*",
  "frame-src https://www.youtube-nocookie.com https://www.youtube.com https://accounts.google.com https://apis.google.com https://ubuhanga-app.firebaseapp.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://ep2.adtrafficquality.google https://www.google.com",
  "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://*.firebase.com wss://*.firebaseio.com https://*.google.com https://accounts.google.com https://oauth.gstatic.com https://*.googleadservices.com https://*.doubleclick.net ep1.adtrafficquality.google https://pagead2.googlesyndication.com https://www.google-analytics.com",
  "font-src 'self'",
  "media-src 'self'",
  "manifest-src 'self'",
  "form-action 'self'",
  "base-uri 'self'",
].join("; ");

const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "X-DNS-Prefetch-Control": "on",
};

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    const user = await verifyAdminSession(context.cookies);
    if (!user) {
      return context.redirect("/admin");
    }
    context.locals.adminUser = user;
  }

  if (pathname.startsWith("/api/admin") && !pathname.endsWith("/session")) {
    const user = await verifyAdminSession(context.cookies);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    context.locals.adminUser = user;
  }

  if (pathname.startsWith("/api/")) {
    const ip = context.request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!rateLimit(ip)) {
      return new Response(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { "Content-Type": "application/json", "Retry-After": "60" },
      });
    }
  }

  const response = await next();

  if (!pathname.startsWith("/api/")) {
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      response.headers.set(key, value);
    }
    if (!pathname.startsWith("/admin/")) {
      response.headers.set("Content-Security-Policy", CSP);
    }
  }

  return response;
});
