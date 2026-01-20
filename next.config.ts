import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/zenn-shiki-theme",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
