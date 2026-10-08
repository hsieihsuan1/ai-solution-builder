import type { NextConfig } from "next";
const nextConfig: NextConfig = { typedRoutes: true, experimental: { cpus: 2 } };
export default nextConfig;
