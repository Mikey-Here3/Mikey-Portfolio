'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

// ==========================================
// TYPES & INTERFACES
// ==========================================

interface HeroProps {
    title?: {
        line1: string;
        line2: string;
        line3: string;
    };
    tagline?: string;
    subtitle?: string;
    ctaPrimary?: {
        label: string;
        href: string;
    };
    ctaSecondary?: {
        label: string;
        href: string;
    };
}

// ==========================================
// CONSTANTS
// ==========================================

const DEFAULT_CONTENT = {
    title: {
        line1: 'CRAFTING',
        line2: 'DIGITAL',
        line3: 'FUTURES',
    },
    tagline: 'Creative Developer & Digital Artisan',
    subtitle: "I build immersive digital experiences at the intersection of design, technology, and art. Specializing in 3D web, creative development, and futuristic interfaces.",
    ctaPrimary: {
        label: 'View Work',
        href: '#projects',
    },
    ctaSecondary: {
        label: 'Get in Touch',
        href: '#contact',
    },
};

const ANIMATION_CONFIG = {
    charStagger: 0.04,
    charDuration: 0.8,
    initialDelay: 1.2,
    subtitleDelay: 2.2,
    ctaDelay: 2.6,
    scrollIndicatorDelay: 3.2,
};

// ==========================================
// SUB-COMPONENTS
// ==========================================

/**
 * AnimatedCharacter
 * Individual character with 3D flip animation
 */
function AnimatedCharacter({
    char,
    index,
    delay = 0,
    isGradient = false,
}: {
    char: string;
    index: number;
    delay?: number;
    isGradient?: boolean;
}) {
    const charRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (charRef.current) {
                gsap.fromTo(
                    charRef.current,
                    {
                        opacity: 0,
                        y: 80,
                        rotateX: -90,
                        scale: 0.8,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                        scale: 1,
                        duration: ANIMATION_CONFIG.charDuration,
                        ease: 'power4.out',
                        delay: index * ANIMATION_CONFIG.charStagger,
                    }
                );
            }
        }, delay * 1000);

        return () => clearTimeout(timer);
    }, [index, delay]);

    const isSpace = char === ' ';

    // For gradient text, we need to inherit the gradient from parent
    const gradientStyle = isGradient ? {
        background: 'inherit',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    } : {};

    return (
        <span
            ref={charRef}
            className="inline-block"
            style={{
                opacity: 0,
                whiteSpace: isSpace ? 'pre' : 'normal',
                display: 'inline-block',
                willChange: 'transform, opacity',
                transformStyle: 'preserve-3d',
                ...gradientStyle,
            }}
        >
            {isSpace ? '\u00A0' : char}
        </span>
    );
}

/**
 * AnimatedLine
 * A line of text with character-by-character animation
 */
function AnimatedLine({
    text,
    delay = 0,
    className = '',
    isGradient = false,
}: {
    text: string;
    delay?: number;
    className?: string;
    isGradient?: boolean;
}) {
    const characters = useMemo(() => text.split(''), [text]);

    return (
        <span
            className={`inline-block ${className}`}
            style={{
                perspective: '1000px',
                perspectiveOrigin: 'center center',
                transformStyle: 'preserve-3d',
            }}
        >
            {characters.map((char, i) => (
                <AnimatedCharacter
                    key={`${char}-${i}`}
                    char={char}
                    index={i}
                    delay={delay}
                    isGradient={isGradient}
                />
            ))}
        </span>
    );
}

/**
 * GradientTextLine
 * Special component for the gradient animated line
 * Uses a different approach to ensure gradient is visible
 */
function GradientTextLine({
    text,
    delay = 0,
}: {
    text: string;
    delay?: number;
}) {
    const containerRef = useRef<HTMLSpanElement>(null);
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (containerRef.current) {
                const chars = containerRef.current.querySelectorAll('.gradient-char');

                gsap.fromTo(
                    chars,
                    {
                        opacity: 0,
                        y: 80,
                        rotateX: -90,
                        scale: 0.8,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                        scale: 1,
                        duration: ANIMATION_CONFIG.charDuration,
                        ease: 'power4.out',
                        stagger: ANIMATION_CONFIG.charStagger,
                        onComplete: () => setIsAnimated(true),
                    }
                );
            }
        }, delay * 1000);

        return () => clearTimeout(timer);
    }, [delay]);

    const characters = useMemo(() => text.split(''), [text]);

    return (
        <span
            ref={containerRef}
            className="inline-block relative"
            style={{
                perspective: '1000px',
                perspectiveOrigin: 'center center',
            }}
        >
            {characters.map((char, i) => {
                const isSpace = char === ' ';

                return (
                    <span
                        key={`${char}-${i}`}
                        className="gradient-char inline-block"
                        style={{
                            opacity: 0,
                            whiteSpace: isSpace ? 'pre' : 'normal',
                            display: 'inline-block',
                            willChange: 'transform, opacity',
                            transformStyle: 'preserve-3d',
                            background: 'linear-gradient(90deg, #00f0ff 0%, #b44aff 50%, #ff2d8a 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            filter: 'drop-shadow(0 0 20px rgba(0,240,255,0.3))',
                        }}
                    >
                        {isSpace ? '\u00A0' : char}
                    </span>
                );
            })}
        </span>
    );
}

/**
 * MagneticButton
 * Interactive button with magnetic cursor effect
 */
function MagneticButton({
    children,
    href,
    className = '',
    variant = 'primary',
}: {
    children: React.ReactNode;
    href: string;
    className?: string;
    variant?: 'primary' | 'secondary';
}) {
    const buttonRef = useRef<HTMLAnchorElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!buttonRef.current || window.innerWidth < 768) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(buttonRef.current, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: 'power2.out',
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (!buttonRef.current) return;
        setIsHovered(false);

        gsap.to(buttonRef.current, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
        });
    }, []);

    if (variant === 'secondary') {
        return (
            <motion.a
                ref={buttonRef}
                href={href}
                className={`group relative text-sm tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors duration-300 flex items-center gap-2 ${className}`}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
            >
                <span>{children}</span>
                <motion.span
                    animate={{ x: isHovered ? 5 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    →
                </motion.span>
            </motion.a>
        );
    }

    return (
        <motion.a
            ref={buttonRef}
            href={href}
            className={`magnetic-btn group relative overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Background glow */}
            <motion.span
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ filter: 'blur(20px)' }}
            />

            {/* Button content */}
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>

            {/* Shine effect */}
            <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
            />
        </motion.a>
    );
}

/**
 * ScrollIndicator
 * Animated scroll prompt with pulse effect
 */
function ScrollIndicator() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, ANIMATION_CONFIG.scrollIndicatorDelay * 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleClick = useCallback(() => {
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.8 }}
                    onClick={handleClick}
                    className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer group"
                    aria-label="Scroll to content"
                >
                    {/* Text */}
                    <span className="text-[0.65rem] sm:text-xs tracking-[0.3em] uppercase text-white/30 group-hover:text-white/50 transition-colors">
                        Scroll
                    </span>

                    {/* Animated line */}
                    <div className="relative w-[1px] h-12 sm:h-16 bg-white/10 overflow-hidden rounded-full">
                        <motion.div
                            className="absolute top-0 left-0 w-full bg-gradient-to-b from-cyan-400 to-transparent"
                            animate={{
                                height: ['0%', '100%'],
                                top: ['0%', '100%'],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    </div>

                    {/* Pulse dot */}
                    <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-cyan-400/50"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                </motion.button>
            )}
        </AnimatePresence>
    );
}

/**
 * FloatingParticles
 * Decorative floating elements around the title
 */
function FloatingParticles() {
    const particles = useMemo(() =>
        Array.from({ length: 6 }, (_, i) => ({
            id: i,
            size: Math.random() * 4 + 2,
            x: Math.random() * 100,
            y: Math.random() * 100,
            duration: Math.random() * 3 + 4,
            delay: Math.random() * 2,
        })),
        []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-cyan-400/30"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        filter: 'blur(1px)',
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function Hero({
    title = DEFAULT_CONTENT.title,
    tagline = DEFAULT_CONTENT.tagline,
    subtitle = DEFAULT_CONTENT.subtitle,
    ctaPrimary = DEFAULT_CONTENT.ctaPrimary,
    ctaSecondary = DEFAULT_CONTENT.ctaSecondary,
}: HeroProps = {}) {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    // Parallax scroll effect
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

    const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
    const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
    const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

    // Mount state for client-side only features
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section
            ref={sectionRef}
            id="hero"
            className="relative z-10 flex items-center justify-center min-h-screen min-h-[100dvh] w-full px-4 sm:px-6 overflow-hidden"
        >
            {/* Background gradient overlay */}
            <div
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{
                    background: `
            radial-gradient(ellipse 80% 60% at 50% 50%, rgba(5,5,16,0.7) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 50% 45%, rgba(0,240,255,0.03) 0%, transparent 50%)
          `,
                }}
            />

            {/* Floating particles */}
            {mounted && <FloatingParticles />}

            {/* Main content */}
            <motion.div
                ref={contentRef}
                className="text-center w-full max-w-5xl mx-auto relative z-[2]"
                style={{
                    opacity: smoothOpacity,
                    y: smoothY,
                    scale: smoothScale,
                }}
            >
                {/* Tagline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="mb-6 sm:mb-8"
                >
                    <div className="inline-flex items-center gap-3">
                        <span className="w-6 sm:w-8 h-[1px] bg-gradient-to-r from-transparent to-cyan-400/50" />
                        <span className="text-[0.65rem] sm:text-xs tracking-[0.3em] uppercase text-cyan-400/70">
                            {tagline}
                        </span>
                        <span className="w-6 sm:w-8 h-[1px] bg-gradient-to-l from-transparent to-cyan-400/50" />
                    </div>
                </motion.div>

                {/* Main Title */}
                <h1
                    className="text-[clamp(2.5rem,10vw,8rem)] font-black leading-[0.9] tracking-tighter mb-6 sm:mb-8"
                    style={{ perspective: '1000px' }}
                >
                    {/* Line 1 - Regular white text */}
                    <span className="block text-white hero-text-shadow">
                        <AnimatedLine
                            text={title.line1}
                            delay={ANIMATION_CONFIG.initialDelay}
                        />
                    </span>

                    {/* Line 2 - Gradient text (FIXED) */}
                    <span className="block relative py-1 sm:py-2">
                        {/* Background glow effect */}
                        <span
                            className="absolute inset-0 blur-3xl opacity-40 pointer-events-none"
                            style={{
                                background: 'linear-gradient(90deg, #00f0ff, #b44aff, #ff2d8a)',
                            }}
                            aria-hidden="true"
                        />

                        {/* The gradient text line */}
                        <GradientTextLine
                            text={title.line2}
                            delay={ANIMATION_CONFIG.initialDelay + 0.3}
                        />
                    </span>

                    {/* Line 3 - Regular white text */}
                    <span className="block text-white hero-text-shadow">
                        <AnimatedLine
                            text={title.line3}
                            delay={ANIMATION_CONFIG.initialDelay + 0.6}
                        />
                    </span>
                </h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ANIMATION_CONFIG.subtitleDelay, duration: 0.8 }}
                    className="text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-8 sm:mb-10 px-4 text-white/50"
                    style={{
                        textShadow: '0 0 30px rgba(5,5,16,1)',
                    }}
                >
                    {subtitle}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ANIMATION_CONFIG.ctaDelay, duration: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                >
                    <MagneticButton href={ctaPrimary.href} variant="primary">
                        {ctaPrimary.label}
                    </MagneticButton>

                    <MagneticButton href={ctaSecondary.href} variant="secondary">
                        {ctaSecondary.label}
                    </MagneticButton>
                </motion.div>

                {/* Decorative radial lines */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.8, duration: 1 }}
                    className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none"
                    aria-hidden="true"
                >
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `
                repeating-conic-gradient(
                  from 0deg,
                  transparent 0deg 8deg,
                  rgba(0,240,255,0.5) 8deg 10deg
                )
              `,
                            mask: 'radial-gradient(circle, transparent 30%, black 70%)',
                            WebkitMask: 'radial-gradient(circle, transparent 30%, black 70%)',
                        }}
                    />
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <ScrollIndicator />

            {/* Bottom gradient fade */}
            <div
                className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-[1]"
                style={{
                    background: 'linear-gradient(to top, rgba(5,5,16,0.8), transparent)',
                }}
                aria-hidden="true"
            />
        </section>
    );
}

export { Hero };