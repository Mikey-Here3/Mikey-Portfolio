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
};

export default nextConfig;
