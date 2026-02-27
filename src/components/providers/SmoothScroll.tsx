'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * SmoothScroll Provider
 * Uses Lenis for buttery-smooth scrolling with inertia.
 * This is crucial for the cinematic scroll experience.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Initialize Lenis with smooth scroll configuration
        const lenis = new Lenis({
            duration: 1.2,        // Scroll duration
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
            touchMultiplier: 2,   // Touch device sensitivity
            infinite: false,
        });

        lenisRef.current = lenis;

        // Animation loop — requestAnimationFrame drives Lenis
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
