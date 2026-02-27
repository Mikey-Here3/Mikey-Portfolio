'use client';

import dynamic from 'next/dynamic';
import SmoothScroll from '@/components/providers/SmoothScroll';
import Hero from '@/components/sections/Hero';
import Projects from '@/components/sections/Projects';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import Navigation from '@/components/ui/Navigation';
import CustomCursor from '@/components/ui/CustomCursor';
import GrainOverlay from '@/components/ui/GrainOverlay';
import LoadingScreen from '@/components/ui/LoadingScreen';

/**
 * Dynamically import the 3D Scene with no SSR.
 * Three.js requires the browser DOM/WebGL context.
 */
const Scene = dynamic(() => import('@/components/canvas/Scene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[#050510] z-0" aria-hidden="true" />
  ),
});

/**
 * Main Page
 * 
 * Layout Structure:
 * - Scene: Fixed background (z-0)
 * - Main content: Relative overlay (z-10)
 * - Navigation: Fixed top (z-[10000])
 * - Cursor/Grain: Fixed overlays (z-[9999])
 * - Loading: Fixed top (z-[10001])
 */
export default function Home() {
  return (
    <SmoothScroll>
      {/* Loading Screen - Highest z-index */}
      <LoadingScreen />

      {/* Custom Cursor - Desktop only, high z-index */}
      <CustomCursor />

      {/* Film Grain Overlay - Decorative, high z-index */}
      <GrainOverlay />

      {/* Navigation - Fixed, high z-index */}
      <Navigation />

      {/* 3D Canvas Background - Fixed, lowest z-index */}
      <Scene />

      {/* 
        FIXED: Main content wrapper
        - w-full: Ensures 100% width
        - min-w-0: Prevents flex children from overflowing
        - relative: Creates stacking context
        - z-10: Above the 3D scene
      */}
      <main className="relative z-10 w-full min-w-0">
        {/* Hero Section - Full viewport */}
        <Hero />

        {/* Projects Section */}
        <Projects />

        {/* About Section */}
        <About />

        {/* Contact Section */}
        <Contact />
      </main>
    </SmoothScroll>
  );
}