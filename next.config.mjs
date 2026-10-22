/** @type {import('next').NextConfig} */
const nextConfig = (phase) => ({
  // Keep development output separate from production builds.
  distDir: phase === "phase-development-server" ? ".next-dev" : ".next",
  eslint: {
    ignoreDuringBuilds: true,
  },
});

export default nextConfig;