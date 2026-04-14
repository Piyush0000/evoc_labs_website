import { signInAnonymously } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from "./client";

export type InternshipApplicationInput = {
  roleId: "fullstack-internship";
  fullName: string;
  email: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  projectLinks?: string;
  message?: string;
};

let signingIn: Promise<void> | null = null;

function withTimeout<T>(promise: Promise<T>, ms: number, code: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(code)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timeoutId) clearTimeout(timeoutId);
  }) as Promise<T>;
}

async function ensureAuthed() {
  if (!isFirebaseConfigured()) {
    throw new Error("FIREBASE_NOT_CONFIGURED");
  }
  const auth = getFirebaseAuth();
  if (auth.currentUser) return;
  signingIn =
    signingIn ??
    signInAnonymously(auth).then(() => {
      signingIn = null;
    });
  await withTimeout(signingIn, 12_000, "FIREBASE_AUTH_TIMEOUT");
}

export async function submitInternshipApplication(input: InternshipApplicationInput) {
  await ensureAuthed();

  const db = getFirebaseDb();
  const apps = collection(db, "applications");

  // 1. Save to Firestore
  await withTimeout(
    addDoc(apps, {
      roleId: input.roleId,
      fullName: input.fullName,
      email: input.email,
      githubUrl: input.githubUrl ?? null,
      portfolioUrl: input.portfolioUrl ?? null,
      resumeUrl: input.resumeUrl ?? null,
      projectLinks: input.projectLinks ?? null,
      message: input.message ?? null,
      createdAt: serverTimestamp(),
      source: "careers_page",
    }),
    12_000,
    "FIREBASE_WRITE_TIMEOUT",
  );

  // 2. Send email notification via API route
  // We do this after Firestore succeeds. If it fails, we log it but don't crash the user flow.
  try {
    const response = await fetch("/api/send-career-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      console.error("Failed to send email notification", await response.text());
    }
  } catch (err) {
    console.error("Error calling email API:", err);
  }
}

