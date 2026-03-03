import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/todo-app-next",
  images: { unoptimized: true },
};

export default nextConfig;
