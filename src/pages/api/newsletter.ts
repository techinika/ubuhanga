import type { APIRoute } from "astro";
import { getDB } from "@/lib/firestore";
import { COLLECTIONS } from "@/lib/constants";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!name) {
      return new Response(JSON.stringify({ error: "Please enter your name." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!email || !EMAIL_RE.test(email)) {
      return new Response(
        JSON.stringify({ error: "Please enter a valid email address." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const db = getDB();
    const existing = await db
      .collection(COLLECTIONS.SUBSCRIBERS)
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existing.empty) {
      return new Response(
        JSON.stringify({ error: "You're already subscribed — no worries!" }),
        { status: 409, headers: { "Content-Type": "application/json" } },
      );
    }

    await db.collection(COLLECTIONS.SUBSCRIBERS).add({
      name,
      email,
      subscribedAt: new Date(),
      source: "homepage-newsletter",
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again in a moment." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
