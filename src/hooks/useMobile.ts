'use client';

import { useState, useEffect } from 'react';

/**
 * Detects mobile viewport for simplifying 3D on mobile.
 */
export function useMobile(breakpoint = 768): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= breakpoint);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, [breakpoint]);

    return isMobile;
}
