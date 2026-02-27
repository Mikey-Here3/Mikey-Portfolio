'use client';

import { useEffect, useRef, useState } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useMobile } from '@/hooks/useMobile';

/**
 * CustomCursor
 * A morphing cursor with two layers:
 * - Inner dot that snaps to mouse position
 * - Outer ring that follows with smooth lerp delay
 * Cursor morphs when hovering interactive elements.
 */
export default function CustomCursor() {
    const mouse = useMousePosition();
    const isMobile = useMobile();
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const [hovering, setHovering] = useState(false);

    // Smooth ring follow position
    const ringPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (isMobile) return;

        let animationId: number;

        const animate = () => {
            // Lerp the ring position for smooth follow effect
            ringPos.current.x += (mouse.x - ringPos.current.x) * 0.12;
            ringPos.current.y += (mouse.y - ringPos.current.y) * 0.12;

            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${mouse.x - 4}px, ${mouse.y - 4}px)`;
            }
            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`;
            }

            animationId = requestAnimationFrame(animate);
        };
        animationId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationId);
    }, [mouse, isMobile]);

    // Detect hoverable elements for cursor morphing
    useEffect(() => {
        if (isMobile) return;

        const hoverables = document.querySelectorAll(
            'a, button, .magnetic-btn, .project-card, [data-cursor-hover]'
        );

        const enter = () => setHovering(true);
        const leave = () => setHovering(false);

        hoverables.forEach((el) => {
            el.addEventListener('mouseenter', enter);
            el.addEventListener('mouseleave', leave);
        });

        return () => {
            hoverables.forEach((el) => {
                el.removeEventListener('mouseenter', enter);
                el.removeEventListener('mouseleave', leave);
            });
        };
    }, [isMobile]);

    if (isMobile) return null;

    return (
        <>
            <div
                ref={dotRef}
                className={`cursor-dot ${hovering ? 'hovering' : ''}`}
            />
            <div
                ref={ringRef}
                className={`cursor-ring ${hovering ? 'hovering' : ''}`}
            />
        </>
    );
}
