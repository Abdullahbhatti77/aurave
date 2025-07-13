import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
// };
const nextConfig: NextConfig = {
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
