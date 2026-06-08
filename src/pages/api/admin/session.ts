import type { APIRoute } from "astro";
import { createAdminSessionCookie, revokeAdminSession } from "@/lib/admin-auth";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { idToken } = body;
    if (!idToken) {
      return new Response(JSON.stringify({ error: "Missing idToken" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const result = await createAdminSessionCookie(idToken);
    if (!result) {
      return new Response(JSON.stringify({ error: "Unauthorized - not an admin" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
    cookies.set("admin-session", result.sessionCookie, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: Math.floor(result.expiresIn / 1000),
    });
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const DELETE: APIRoute = async ({ cookies }) => {
  await revokeAdminSession(cookies);
  cookies.delete("admin-session", { path: "/" });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
