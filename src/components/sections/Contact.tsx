'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// ==========================================
// CONSTANTS
// ==========================================

const EMAIL = 'ashanmirofficial@gmail.com';

const CONTACT_METHODS = [
    {
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        label: 'Email',
        value: EMAIL,
        href: `mailto:${EMAIL}`,
        color: '#00f0ff',
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        label: 'Location',
        value: 'Islamabad, Pakistan',
        href: '#',
        color: '#b44aff',
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        label: 'Status',
        value: 'Open for projects',
        href: '#',
        color: '#00ff88',
    },
];

const SOCIALS = [
    { label: 'GitHub', href: 'https://github.com/Mikey-Here3', icon: 'github' },
    { label: 'Instagram', href: 'https://instagram.com/ashan.mir69', icon: 'instagram' },
    { label: 'Twitter', href: 'https://twitter.com/mikey', icon: 'twitter' },
    { label: 'Dribbble', href: 'https://dribbble.com/mikey', icon: 'dribbble' },
];

const socialIcons: Record<string, React.ReactNode> = {
    github: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
    ),
    instagram: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    ),
    twitter: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    dribbble: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.81zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855z" />
        </svg>
    ),
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function Contact() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleCopyEmail = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            window.location.href = `mailto:${EMAIL}`;
        }
    }, []);

    return (
        <section
            ref={sectionRef}
            id="contact"
            className="content-section relative z-10 py-24 sm:py-32 lg:py-40"
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header - Centered */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-pink-400/50" />
                        <span className="text-[0.65rem] sm:text-xs tracking-[0.3em] uppercase text-pink-400/70">
                            Get in Touch
                        </span>
                        <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-pink-400/50" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                        Let's Build
                        <br />
                        <span className="gradient-text">Something Epic</span>
                    </h2>

                    <p className="text-base sm:text-lg text-white/40 max-w-xl mx-auto">
                        Have a project in mind? I'd love to hear about it — whether it's a creative experiment, a product launch, or something entirely new.
                    </p>
                </motion.div>

                {/* Email CTA - Centered */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <button
                        onClick={handleCopyEmail}
                        className="relative group inline-flex items-center gap-3 px-8 py-4 bg-white/[0.02] border border-white/10 hover:border-cyan-400/30 rounded-2xl transition-all duration-300"
                    >
                        <span
                            className="text-xl sm:text-2xl font-semibold"
                            style={{
                                background: 'linear-gradient(90deg, #00f0ff, #b44aff, #ff2d8a)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            {EMAIL}
                        </span>

                        {/* Copy icon */}
                        <span className="text-white/30 group-hover:text-cyan-400 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </span>

                        {/* Copied tooltip */}
                        <AnimatePresence>
                            {copied && (
                                <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan-400/20 border border-cyan-400/30 rounded-full text-xs text-cyan-400"
                                >
                                    Copied!
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>

                    <p className="text-xs text-white/30 mt-3">Click to copy email</p>
                </motion.div>

                {/* Contact Methods - 3 Column Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="grid sm:grid-cols-3 gap-4 mb-12"
                >
                    {CONTACT_METHODS.map((method, i) => (
                        <div
                            key={method.label}
                            className="glass-card p-5 flex items-center gap-4 group hover:border-white/20 transition-colors"
                        >
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                                style={{
                                    backgroundColor: `${method.color}15`,
                                    color: method.color,
                                }}
                            >
                                {method.icon}
                            </div>
                            <div>
                                <span className="block text-[0.6rem] tracking-widest uppercase text-white/30 mb-0.5">
                                    {method.label}
                                </span>
                                <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                                    {method.value}
                                </span>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Social Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-xs text-white/30 tracking-wider uppercase mb-4">
                        Find me on
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        {SOCIALS.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-white/30 hover:text-cyan-400 hover:border-cyan-400/30 transition-all duration-300"
                                aria-label={social.label}
                            >
                                {socialIcons[social.icon]}
                            </a>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="mt-24 sm:mt-32 border-t border-white/5">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                        {/* Brand */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold tracking-[0.15em] gradient-text">MIKEY</span>
                            <span className="text-white/20">•</span>
                            <span className="text-xs text-white/30">Creative Developer</span>
                        </div>

                        {/* Tagline */}
                        <span className="text-[0.65rem] text-white/20 tracking-widest uppercase">
                            Crafted with passion & pixels
                        </span>

                        {/* Copyright */}
                        <span className="text-xs text-white/30">
                            © {mounted ? new Date().getFullYear() : 2024} All rights reserved
                        </span>
                    </div>
                </div>
            </footer>
        </section>
    );
}
