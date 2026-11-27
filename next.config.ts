import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: process.cwd(),
  poweredByHeader: false,
  devIndicators: false,
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
