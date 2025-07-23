import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Optional: Useful for Vercel or other deployments
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
    domains: ["images.unsplash.com"],
  },
};

export default nextConfig;
