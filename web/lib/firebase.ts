"use client";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-agrisense.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-agrisense",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "demo-app-id",
};
const app = getApps().length ? getApps()[0] : initializeApp(cfg);
export const auth = getAuth(app);
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL) {
  try { connectAuthEmulator(auth, process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL, { disableWarnings: true }); } catch {}
}
export const getIdToken = async () => auth.currentUser ? await auth.currentUser.getIdToken() : null;
