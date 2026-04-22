"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { submitInternshipApplication } from "@/lib/firebase/submitApplication";
import type { FirebaseError } from "firebase/app";

type Status = "idle" | "submitting" | "success" | "error";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function getFirebaseErrorCode(err: unknown): string | null {
  const anyErr = err as Partial<FirebaseError> | null | undefined;
  if (!anyErr || typeof anyErr !== "object") return null;
  return typeof anyErr.code === "string" ? anyErr.code : null;
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-white/20"
        autoComplete="off"
      />
    </label>
  );
}

export default function CareersApplicationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [projectLinks, setProjectLinks] = useState("");
  const [message, setMessage] = useState("");

  const canSubmit = useMemo(() => {
    return (
      fullName.trim().length >= 2 &&
      isEmail(email) &&
      githubUrl.trim().length > 0 &&
      portfolioUrl.trim().length > 0 &&
      resumeUrl.trim().length > 0 &&
      projectLinks.trim().length > 0 &&
      message.trim().length > 0 &&
      status !== "submitting"
    );
  }, [
    email,
    fullName,
    githubUrl,
    portfolioUrl,
    resumeUrl,
    projectLinks,
    message,
    status,
  ]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("submitting");
    setErrorMessage("");
    try {
      await submitInternshipApplication({
        roleId: "fullstack-internship",
        fullName: fullName.trim(),
        email: email.trim(),
        githubUrl: githubUrl.trim() || undefined,
        portfolioUrl: portfolioUrl.trim() || undefined,
        resumeUrl: resumeUrl.trim() || undefined,
        projectLinks: projectLinks.trim() || undefined,
        message: message.trim() || undefined,
      });
      setStatus("success");
      // Clear all fields so the user can't accidentally re-submit
      setFullName("");
      setEmail("");
      setGithubUrl("");
      setPortfolioUrl("");
      setResumeUrl("");
      setProjectLinks("");
      setMessage("");
      // Show success toast
      toast.success("Application submitted! 🎉", {
        description: "We'll review it and get back to you soon.",
        duration: 5000,
      });
      // Reset to idle after a short delay so the form is fresh
      setTimeout(() => setStatus("idle"), 500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      const code = getFirebaseErrorCode(err);

      if (msg === "FIREBASE_NOT_CONFIGURED") {
        setErrorMessage(
          "Firebase isn’t configured. Add your Firebase keys to .env.local and restart the dev server.",
        );
      } else if (msg === "FIREBASE_AUTH_TIMEOUT") {
        setErrorMessage(
          "Firebase Auth is taking too long. Check your internet/VPN, then try again.",
        );
      } else if (msg === "FIREBASE_WRITE_TIMEOUT") {
        setErrorMessage(
          "Saving to Firestore is taking too long. Check Firestore is created + rules are published, then try again.",
        );
      } else if (code === "auth/operation-not-allowed" || msg.includes("auth/operation-not-allowed")) {
        setErrorMessage(
          "Anonymous Auth is disabled in Firebase. Enable it in Firebase Console → Authentication → Sign-in method.",
        );
      } else if (code === "permission-denied" || msg.includes("permission-denied")) {
        setErrorMessage(
          "Firestore blocked the request (permission denied). Deploy the provided Firestore rules and try again.",
        );
      } else if (code === "failed-precondition" || msg.includes("failed-precondition")) {
        setErrorMessage(
          "Firestore isn’t ready for this project (failed precondition). Create Firestore Database in Firebase Console, then try again.",
        );
      } else if (code === "auth/network-request-failed" || msg.includes("network-request-failed")) {
        setErrorMessage(
          "Network request failed. Check internet/VPN or try again in a fresh tab.",
        );
      } else {
        setErrorMessage(
          code
            ? `Something went wrong (${code}). Please try again.`
            : "Something went wrong. Please try again.",
        );
      }
      setStatus("error");
    }
  }

  return (
    <section id="apply" className="mt-14">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md overflow-hidden">
        <div className="px-6 py-6 border-b border-white/10">
          <p className="text-white text-lg font-semibold">Apply for this role</p>
          <p className="mt-1 text-zinc-400 text-sm">
            Your application is saved securely. We don’t print applicant data to
            the console.
          </p>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full name *"
              value={fullName}
              onChange={setFullName}
              placeholder="Your name"
              required
            />
            <Input
              label="Email *"
              value={email}
              onChange={setEmail}
              placeholder="you@email.com"
              type="email"
              required
            />
            <Input
              label="GitHub *"
              value={githubUrl}
              onChange={setGithubUrl}
              placeholder="https://github.com/username"
              required
            />
            <Input
              label="Portfolio *"
              value={portfolioUrl}
              onChange={setPortfolioUrl}
              placeholder="https://your-portfolio.com"
              required
            />
            <Input
              label="Resume link *"
              value={resumeUrl}
              onChange={setResumeUrl}
              placeholder="Drive / Notion / PDF link"
              required
            />
            <Input
              label="Next.js project links *"
              value={projectLinks}
              onChange={setProjectLinks}
              placeholder="Comma-separated links"
              required
            />
          </div>

          <label className="block mt-4">
            <span className="text-sm font-medium text-zinc-300">
              Message *
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Tell us what you’ve built, what you want to learn, and why you’re a fit."
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-white/20 resize-y"
              required
            />
          </label>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
            <div className="text-sm">
              {status === "success" && (
                <span className="text-emerald-300">
                  Application submitted. We’ll get back to you soon.
                </span>
              )}
              {status === "error" && (
                <span className="text-rose-300">
                  {errorMessage || "Something went wrong. Please try again."}
                </span>
              )}
              {status === "idle" && (
                <span className="text-zinc-500">
                  * Required fields
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "Submitting…" : "Submit application"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

