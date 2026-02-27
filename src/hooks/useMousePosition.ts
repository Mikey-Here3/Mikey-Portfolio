'use client';

import { useState, useEffect, useCallback } from 'react';

interface MousePosition {
    x: number;
    y: number;
    normalizedX: number; // -1 to 1
    normalizedY: number; // -1 to 1
}

/**
 * Tracks mouse position globally.
 * Returns both raw pixel coordinates and normalized coordinates
 * for use with 3D camera movement and parallax effects.
 */
export function useMousePosition(): MousePosition {
    const [position, setPosition] = useState<MousePosition>({
        x: 0,
        y: 0,
        normalizedX: 0,
        normalizedY: 0,
    });

    const handleMouseMove = useCallback((e: MouseEvent) => {
        setPosition({
            x: e.clientX,
            y: e.clientY,
            normalizedX: (e.clientX / window.innerWidth) * 2 - 1,
            normalizedY: -(e.clientY / window.innerHeight) * 2 + 1,
        });
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    return position;
}
