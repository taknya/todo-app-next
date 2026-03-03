import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GITHUB_ACTIONS ? "/todo-app-next" : "",
  images: { unoptimized: true },
};

export default nextConfig;
