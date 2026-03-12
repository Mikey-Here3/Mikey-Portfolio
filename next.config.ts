import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile Three.js ecosystem packages
  transpilePackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/postprocessing',
    'postprocessing',
  ],

  // Suppress React hydration warnings from browser extensions
  reactStrictMode: true,

  // Allow external images from Unsplash
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
