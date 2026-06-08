import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";

export function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];

  return initializeApp({
    credential: cert({
      projectId: import.meta.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: import.meta.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: import.meta.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    } as ServiceAccount),
  });
}
