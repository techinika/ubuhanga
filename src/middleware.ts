import { defineMiddleware } from "astro/middleware";
import { verifyAdminSession } from "./lib/admin-auth";

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

  return next();
});
