'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

/**
 * LoadingScreen
 * Cinematic loading screen with animated progress bar and text.
 * Simulates asset loading for a premium feel.
 * Fades out to reveal the main experience.
 */
export default function LoadingScreen() {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const counterRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        // Animate progress from 0 to 100
        const duration = 2000; // 2 seconds
        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const p = Math.min((elapsed / duration) * 100, 100);
            setProgress(Math.round(p));

            if (p >= 100) {
                clearInterval(interval);
                setTimeout(() => setIsComplete(true), 400);
            }
        }, 30);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (counterRef.current) {
            gsap.to(counterRef.current, {
                innerText: progress,
                duration: 0.3,
                snap: { innerText: 1 },
                ease: 'power2.out',
            });
        }
    }, [progress]);

    return (
        <AnimatePresence>
            {!isComplete && (
                <motion.div
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="loading-screen"
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="text-2xl font-bold tracking-[0.3em] gradient-text">
                            MIKEY
                        </span>
                    </motion.div>

                    {/* Progress bar */}
                    <div className="loading-bar">
                        <div
                            className="loading-bar-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Progress counter */}
                    <div className="flex items-baseline gap-1">
                        <span
                            ref={counterRef}
                            className="text-xs font-mono tracking-widest text-white/30"
                        >
                            0
                        </span>
                        <span className="text-xs font-mono tracking-widest text-white/30">
                            %
                        </span>
                    </div>

                    {/* Status text */}
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-[0.65rem] tracking-[0.3em] uppercase text-white/15"
                    >
                        Initializing Experience
                    </motion.span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
