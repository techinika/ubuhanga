import type { APIRoute } from "astro";
import { getDB } from "@/lib/firestore";
import { COLLECTIONS } from "@/lib/constants";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_TYPES = ["tutorial", "question"] as const;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const type =
      typeof body.type === "string" &&
      VALID_TYPES.includes(body.type as (typeof VALID_TYPES)[number])
        ? body.type
        : "question";
    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    if (!name) {
      return new Response(
        JSON.stringify({ error: "Please enter your name." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (!email || !EMAIL_RE.test(email)) {
      return new Response(
        JSON.stringify({ error: "Please enter a valid email address." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Please enter your message or request." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const db = getDB();
    await db.collection(COLLECTIONS.REQUESTS).add({
      name,
      email,
      type,
      message,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({
        error:
          "Something went wrong. Please try again in a moment.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
