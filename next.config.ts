import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  transpilePackages: ['asasvirtuais']
};

export default nextConfig;
