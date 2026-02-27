'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Returns the global scroll progress (0 to 1).
 * Used for scroll-driven 3D transitions and parallax effects.
 */
export function useScrollProgress(): number {
    const [progress, setProgress] = useState(0);

    const handleScroll = useCallback(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
        setProgress(Math.min(Math.max(scrollPercent, 0), 1));
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return progress;
}
