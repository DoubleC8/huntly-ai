import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
       {
        protocol: 'https',
        hostname: 'img.logo.dev',
        port: '', // Optional: Specify if a non-standard port is used
        pathname: '/**', // Optional: Restrict to specific paths
      }, 
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org'
      }
    ]
  },
};

export default nextConfig;
