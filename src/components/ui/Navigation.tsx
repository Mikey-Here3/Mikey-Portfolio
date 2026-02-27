'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useSpring, useMotionValueEvent, AnimatePresence, Variants, Transition } from 'framer-motion';
import gsap from 'gsap';

/**
 * Navigation
 * Professional navigation bar with advanced features.
 * 
 * Features:
 * - Glassmorphism with scroll-aware transparency
 * - Scroll progress indicator
 * - Magnetic hover effects
 * - Full-screen mobile menu with staggered animations
 * - Active section highlighting
 * - Hide on scroll down, show on scroll up
 * - Smooth scroll to sections
 * - Keyboard accessibility
 */

// ==========================================
// TYPES & INTERFACES
// ==========================================

interface NavItem {
    label: string;
    href: string;
    icon?: React.ReactNode;
}

interface NavigationProps {
    brand?: string;
    items?: NavItem[];
    ctaLabel?: string;
    ctaHref?: string;
    showProgress?: boolean;
    hideOnScroll?: boolean;
}

// ==========================================
// CONSTANTS
// ==========================================

const DEFAULT_NAV_ITEMS: NavItem[] = [
    {
        label: 'Work',
        href: '#projects',
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ),
    },
    {
        label: 'About',
        href: '#about',
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
    {
        label: 'Contact',
        href: '#contact',
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
];

const ANIMATION_CONFIG = {
    navDelay: 2.5,
    menuStagger: 0.1,
    scrollThreshold: 100,
    hideThreshold: 300,
};

// ==========================================
// ANIMATION VARIANTS (Fixed TypeScript types)
// ==========================================

const menuVariants: Variants = {
    closed: {
        opacity: 0,
        transition: {
            duration: 0.3,
        },
    },
    open: {
        opacity: 1,
        transition: {
            duration: 0.4,
        },
    },
};

const menuItemVariants: Variants = {
    closed: {
        opacity: 0,
        x: -50,
    },
    open: {
        opacity: 1,
        x: 0,
    },
};

const menuLineVariants: Variants = {
    closed: {
        rotate: 0,
        y: 0,
        opacity: 1,
    },
    open: {
        rotate: 0,
        y: 0,
        opacity: 1,
    },
};

// ==========================================
// SUB-COMPONENTS
// ==========================================

/**
 * ScrollProgressBar
 * Animated progress indicator showing scroll position
 */
function ScrollProgressBar() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <motion.div
            style={{ scaleX }}
            className="fixed top-0 left-0 right-0 h-[2px] z-[10001] origin-left"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500" />
            <div className="absolute inset-0 blur-sm bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-50" />
        </motion.div>
    );
}

/**
 * MagneticNavLink
 * Navigation link with magnetic hover effect
 */
function MagneticNavLink({
    item,
    isActive,
    onClick,
}: {
    item: NavItem;
    isActive: boolean;
    onClick: () => void;
}) {
    const linkRef = useRef<HTMLAnchorElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!linkRef.current || window.innerWidth < 768) return;

        const rect = linkRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(linkRef.current, {
            x: x * 0.2,
            y: y * 0.2,
            duration: 0.3,
            ease: 'power2.out',
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (!linkRef.current) return;
        setIsHovered(false);

        gsap.to(linkRef.current, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
        });
    }, []);

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        onClick();

        const targetId = item.href.replace('#', '');
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }, [item.href, onClick]);

    return (
        <motion.a
            ref={linkRef}
            href={item.href}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className={`relative px-4 py-2 text-sm tracking-wider uppercase transition-colors duration-300 ${isActive ? 'text-cyan-400' : 'text-white/50 hover:text-white/90'
                }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <span className="relative z-10">{item.label}</span>

            <motion.span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: isActive ? '60%' : isHovered ? '40%' : 0 }}
                transition={{ duration: 0.3 }}
            />

            <motion.span
                className="absolute inset-0 rounded-lg bg-white/5 -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
            />
        </motion.a>
    );
}

/**
 * CTAButton
 * Call-to-action button with advanced hover effects
 */
function CTAButton({
    label,
    href,
    onClick,
}: {
    label: string;
    href: string;
    onClick: () => void;
}) {
    const buttonRef = useRef<HTMLAnchorElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!buttonRef.current || window.innerWidth < 768) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(buttonRef.current, {
            x: x * 0.15,
            y: y * 0.15,
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

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        onClick();

        const targetId = href.replace('#', '');
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }, [href, onClick]);

    return (
        <motion.a
            ref={buttonRef}
            href={href}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="relative group px-5 py-2.5 rounded-full text-xs tracking-widest uppercase overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <span className="absolute inset-0 bg-white/5 border border-white/10 rounded-full transition-all duration-300 group-hover:border-cyan-400/30 group-hover:bg-cyan-400/5" />

            <motion.span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: 'linear-gradient(90deg, rgba(0,240,255,0.2), rgba(180,74,255,0.2), rgba(255,45,138,0.2))',
                    padding: '1px',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'xor',
                    WebkitMaskComposite: 'xor',
                }}
            />

            <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                animate={{ translateX: isHovered ? '200%' : '-100%' }}
                transition={{ duration: 0.6 }}
            />

            <span className="relative z-10 text-white/70 group-hover:text-white transition-colors duration-300">
                {label}
            </span>

            <motion.span
                className="absolute inset-0 rounded-full blur-xl bg-cyan-400/20 -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />
        </motion.a>
    );
}

/**
 * MobileMenuButton
 * Animated hamburger menu button
 */
function MobileMenuButton({
    isOpen,
    onClick
}: {
    isOpen: boolean;
    onClick: () => void;
}) {
    return (
        <motion.button
            onClick={onClick}
            className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-[10002]"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            whileTap={{ scale: 0.9 }}
        >
            {/* Top line */}
            <motion.span
                className="block w-6 h-[2px] bg-white/70 rounded-full origin-center"
                animate={{
                    rotate: isOpen ? 45 : 0,
                    y: isOpen ? 6 : 0,
                }}
                transition={{ duration: 0.3 }}
            />
            {/* Middle line */}
            <motion.span
                className="block w-5 h-[2px] bg-white/70 rounded-full origin-center"
                animate={{
                    opacity: isOpen ? 0 : 1,
                    x: isOpen ? -20 : 0,
                }}
                transition={{ duration: 0.3 }}
            />
            {/* Bottom line */}
            <motion.span
                className="block w-6 h-[2px] bg-white/70 rounded-full origin-center"
                animate={{
                    rotate: isOpen ? -45 : 0,
                    y: isOpen ? -6 : 0,
                }}
                transition={{ duration: 0.3 }}
            />
        </motion.button>
    );
}

/**
 * MobileMenu
 * Full-screen mobile navigation menu
 */
function MobileMenu({
    isOpen,
    items,
    activeSection,
    onClose,
    brand,
}: {
    isOpen: boolean;
    items: NavItem[];
    activeSection: string;
    onClose: () => void;
    brand: string;
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleItemClick = useCallback((href: string) => {
        onClose();

        setTimeout(() => {
            const targetId = href.replace('#', '');
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const displayYear = mounted ? new Date().getFullYear() : 2024;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={menuVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="fixed inset-0 z-[9999] md:hidden"
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-[#050510]/98 backdrop-blur-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                    />

                    {/* Menu content */}
                    <div className="relative h-full flex flex-col justify-center px-8">
                        {/* Brand in menu */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="absolute top-6 left-6"
                        >
                            <span className="text-lg font-bold tracking-widest gradient-text">
                                {brand}
                            </span>
                            <span className="text-white/30 ml-1">.</span>
                        </motion.div>

                        {/* Navigation items */}
                        <nav className="space-y-2">
                            {items.map((item, i) => {
                                const isActive = activeSection === item.href.replace('#', '');

                                return (
                                    <motion.a
                                        key={item.label}
                                        href={item.href}
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{
                                            delay: 0.1 + i * ANIMATION_CONFIG.menuStagger,
                                            duration: 0.5
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleItemClick(item.href);
                                        }}
                                        className={`flex items-center gap-4 py-4 border-b border-white/5 group ${isActive ? 'text-cyan-400' : 'text-white/70'
                                            }`}
                                    >
                                        {/* Icon */}
                                        <span className={`p-3 rounded-xl transition-colors duration-300 ${isActive
                                                ? 'bg-cyan-400/10 text-cyan-400'
                                                : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/60'
                                            }`}>
                                            {item.icon}
                                        </span>

                                        {/* Label */}
                                        <div className="flex-1">
                                            <span className="text-2xl sm:text-3xl font-light tracking-wide">
                                                {item.label}
                                            </span>
                                        </div>

                                        {/* Arrow */}
                                        <motion.span
                                            className="text-white/20 group-hover:text-white/40 transition-colors"
                                            animate={{ x: isActive ? 5 : 0 }}
                                        >
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </motion.span>
                                    </motion.a>
                                );
                            })}
                        </nav>

                        {/* CTA in menu */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="mt-12"
                        >
                            <a
                                href="#contact"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleItemClick('#contact');
                                }}
                                className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-white"
                            >
                                <span className="text-sm tracking-widest uppercase">Let&apos;s Talk</span>
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            </a>
                        </motion.div>

                        {/* Social links in menu */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="absolute bottom-8 left-8 right-8"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-white/30 tracking-wider">
                                    © {displayYear}
                                </span>
                                <div className="flex items-center gap-4">
                                    {['GitHub', 'LinkedIn', 'Twitter'].map((social) => (
                                        <a
                                            key={social}
                                            href="#"
                                            className="text-xs text-white/30 hover:text-cyan-400 transition-colors"
                                        >
                                            {social}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/**
 * Logo
 * Animated brand logo with hover effects
 */
function Logo({ brand }: { brand: string }) {
    const logoRef = useRef<HTMLAnchorElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!logoRef.current || window.innerWidth < 768) return;

        const rect = logoRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(logoRef.current, {
            x: x * 0.2,
            y: y * 0.2,
            duration: 0.3,
            ease: 'power2.out',
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (!logoRef.current) return;
        setIsHovered(false);

        gsap.to(logoRef.current, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
        });
    }, []);

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <motion.a
            ref={logoRef}
            href="#hero"
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="relative flex items-center gap-1 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <span className="text-lg font-bold tracking-[0.2em] gradient-text">
                {brand}
            </span>

            <span className="relative">
                <span className="text-white/30 text-lg">.</span>
                <motion.span
                    className="absolute rounded-full bg-cyan-400"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        scale: isHovered ? 1 : 0,
                        opacity: isHovered ? 1 : 0
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ width: 4, height: 4, top: '50%', left: '50%', marginTop: -2, marginLeft: -2 }}
                />
            </span>

            <motion.span
                className="absolute -bottom-1 left-0 h-[1px] bg-gradient-to-r from-cyan-400 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: isHovered ? '100%' : 0 }}
                transition={{ duration: 0.3 }}
            />
        </motion.a>
    );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function Navigation({
    brand = 'MIKEY',
    items = DEFAULT_NAV_ITEMS,
    ctaLabel = "Let's Talk",
    ctaHref = '#contact',
    showProgress = true,
    hideOnScroll = true,
}: NavigationProps = {}) {
    const navRef = useRef<HTMLElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const lastScrollY = useRef(0);

    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, 'change', (latest) => {
        setIsScrolled(latest > ANIMATION_CONFIG.scrollThreshold);

        if (hideOnScroll && !isMobileMenuOpen) {
            const isScrollingDown = latest > lastScrollY.current;
            const isPastThreshold = latest > ANIMATION_CONFIG.hideThreshold;

            setIsHidden(isScrollingDown && isPastThreshold);
        }

        lastScrollY.current = latest;
    });

    useEffect(() => {
        const sections = items.map((item) => item.href.replace('#', ''));

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-50% 0px -50% 0px' }
        );

        sections.forEach((section) => {
            const element = document.getElementById(section);
            if (element) observer.observe(element);
        });

        const heroElement = document.getElementById('hero');
        if (heroElement) observer.observe(heroElement);

        return () => observer.disconnect();
    }, [items]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isMobileMenuOpen]);

    const handleNavClick = useCallback(() => {
        setIsMobileMenuOpen(false);
    }, []);

    return (
        <>
            {showProgress && <ScrollProgressBar />}

            <motion.nav
                ref={navRef}
                initial={{ y: -100, opacity: 0 }}
                animate={{
                    y: isHidden ? -100 : 0,
                    opacity: isHidden ? 0 : 1
                }}
                transition={{
                    delay: isHidden ? 0 : ANIMATION_CONFIG.navDelay,
                    duration: 0.5,
                    ease: 'easeOut'
                }}
                className={`fixed top-0 left-0 right-0 z-[10000] transition-all duration-500 ${isScrolled
                        ? 'bg-[#050510]/80 backdrop-blur-xl border-b border-white/5'
                        : 'bg-transparent'
                    }`}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
                    <Logo brand={brand} />

                    <div className="hidden md:flex items-center gap-2">
                        {items.map((item) => (
                            <MagneticNavLink
                                key={item.label}
                                item={item}
                                isActive={activeSection === item.href.replace('#', '')}
                                onClick={handleNavClick}
                            />
                        ))}

                        <span className="w-[1px] h-6 bg-white/10 mx-2" />

                        <CTAButton
                            label={ctaLabel}
                            href={ctaHref}
                            onClick={handleNavClick}
                        />
                    </div>

                    <MobileMenuButton
                        isOpen={isMobileMenuOpen}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    />
                </div>
            </motion.nav>

            <MobileMenu
                isOpen={isMobileMenuOpen}
                items={items}
                activeSection={activeSection}
                onClose={() => setIsMobileMenuOpen(false)}
                brand={brand}
            />
        </>
    );
}

export { Navigation };