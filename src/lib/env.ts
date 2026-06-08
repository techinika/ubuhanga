const requiredVars = [
  "PUBLIC_FIREBASE_API_KEY",
  "PUBLIC_FIREBASE_AUTH_DOMAIN",
  "PUBLIC_FIREBASE_PROJECT_ID",
  "PUBLIC_FIREBASE_STORAGE_BUCKET",
  "PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "PUBLIC_FIREBASE_APP_ID",
  "PUBLIC_ADSENSE_ID",
  "FIREBASE_ADMIN_PROJECT_ID",
  "FIREBASE_ADMIN_CLIENT_EMAIL",
  "FIREBASE_ADMIN_PRIVATE_KEY",
] as const;

export function validateEnv(): void {
  if (typeof process === "undefined") return;
  const missing: string[] = [];
  for (const key of requiredVars) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n  ${missing.join("\n  ")}\n\nCopy .env.example to .env.local and fill in the values.`,
    );
  }
}
