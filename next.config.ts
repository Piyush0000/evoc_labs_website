import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")?.[1];
const prodBasePath =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (repoName ? `/${repoName}` : "/EvocLabs-Next.js");

const nextConfig: NextConfig = {
  // Automatically detect the environment:
  // 1. If on GitHub Actions -> enable static export for GitHub Pages
  // 2. If on Vercel or Local -> disable export to keep API routes and Styles working
  output: process.env.GITHUB_ACTIONS ? "export" : undefined,
  // Only use custom distDir for GitHub Pages (via CI)
  ...(process.env.GITHUB_ACTIONS ? { distDir: "dist" } : {}),
  // GitHub Pages usually needs a basePath (e.g. /repo-name). 
  // Vercel and local development should NOT have this.
  basePath: process.env.GITHUB_ACTIONS ? prodBasePath : undefined,
  assetPrefix: process.env.GITHUB_ACTIONS ? prodBasePath : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
