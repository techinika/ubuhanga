import {
  initializeApp,
  getApps,
  cert,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import type { AstroCookies } from "astro";

function getAdminApp() {
  if (getApps().length === 0) {
    return initializeApp({
      credential: cert({
        projectId: import.meta.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: import.meta.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: import.meta.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n",
        ),
      }),
    });
  }
  return getApps()[0];
}

export async function verifyAdminSession(
  cookies: AstroCookies,
): Promise<{ uid: string; email: string } | null> {
  const sessionCookie = cookies.get("admin-session")?.value;
  if (!sessionCookie) return null;

  try {
    getAdminApp();
    const decoded = await getAuth().verifySessionCookie(sessionCookie, true);
    const db = getFirestore();
    const adminDoc = await db.collection("admins").doc(decoded.uid).get();
    if (!adminDoc.exists) return null;
    return { uid: decoded.uid, email: decoded.email || "" };
  } catch {
    return null;
  }
}

export async function createAdminSessionCookie(
  idToken: string,
): Promise<{ sessionCookie: string; expiresIn: number } | null> {
  try {
    getAdminApp();
    const decoded = await getAuth().verifyIdToken(idToken);
    const db = getFirestore();
    const adminDoc = await db.collection("admins").doc(decoded.uid).get();
    if (!adminDoc.exists) return null;
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await getAuth().createSessionCookie(idToken, {
      expiresIn,
    });
    return { sessionCookie, expiresIn };
  } catch {
    return null;
  }
}

export async function revokeAdminSession(
  cookies: AstroCookies,
): Promise<void> {
  const sessionCookie = cookies.get("admin-session")?.value;
  if (!sessionCookie) return;
  try {
    getAdminApp();
    const decoded = await getAuth().verifySessionCookie(sessionCookie, false);
    await getAuth().revokeRefreshTokens(decoded.sub);
  } catch {
    // ignore errors on revoke
  }
}
