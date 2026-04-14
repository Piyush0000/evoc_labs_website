import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")?.[1];
const prodBasePath =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (repoName ? `/${repoName}` : "/EvocLabs-Next.js");

const nextConfig: NextConfig = {
  // Only use static export if explicitly requested (e.g. for GitHub Pages)
  // Vercel deployment should NOT use 'export' as it breaks API routes and some styling.
  output: process.env.IS_STATIC_EXPORT ? "export" : undefined,
  distDir: isProd ? "dist" : ".next",
  // GitHub Pages usually needs a basePath (e.g. /repo-name). 
  // Vercel and local development should NOT have this.
  basePath: process.env.IS_GITHUB_PAGES ? prodBasePath : undefined,
  assetPrefix: process.env.IS_GITHUB_PAGES ? prodBasePath : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
