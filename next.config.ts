import { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "30mb", // Increase the limit (adjust as needed)
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google profile images
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cloudinary images
      },
    ],
  },
   webpack: (config) => {
    config.watchOptions = {
      poll: 1000, // Check files every second (good for HDDs)
      aggregateTimeout: 300,
    };
    return config;
  },
};

export default nextConfig;
