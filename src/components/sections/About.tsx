'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// CONSTANTS
// ==========================================

const STATS = [
    { value: 5, suffix: '+', label: 'Years Experience', color: '#00f0ff' },
    { value: 40, suffix: '+', label: 'Projects Delivered', color: '#b44aff' },
    { value: 25, suffix: '+', label: 'Happy Clients', color: '#ff2d8a' },
    { value: 8, suffix: '', label: 'Awards Won', color: '#00ff88' },
];

const SKILLS = [
    { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Vue'] },
    { category: 'Creative', items: ['Three.js', 'WebGL', 'GSAP', 'Framer Motion'] },
    { category: 'Design', items: ['Figma', 'UI/UX', 'Motion Design', 'Prototyping'] },
    { category: 'Backend', items: ['Node.js', 'Python', 'PostgreSQL', 'AWS'] },
];

// ==========================================
// SUB-COMPONENTS
// ==========================================

function AnimatedCounter({ value, suffix, duration = 2 }: { value: number; suffix: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    useEffect(() => {
        if (!isInView) return;

        let startTime: number;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            setCount(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [isInView, value, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
}

function StatCard({ stat, index }: { stat: typeof STATS[0]; index: number }) {
    const isInView = useInView(useRef(null), { once: true });

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="relative group"
        >
            {/* Card */}
            <div className="glass-card p-6 sm:p-8 text-center relative overflow-hidden">
                {/* Glow effect */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: `radial-gradient(circle at center, ${stat.color}15 0%, transparent 70%)`,
                    }}
                />

                {/* Value */}
                <div
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 relative"
                    style={{ color: stat.color }}
                >
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <p className="text-xs sm:text-sm text-white/40 tracking-wider uppercase">
                    {stat.label}
                </p>

                {/* Bottom accent */}
                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-1/2 transition-all duration-500"
                    style={{ background: stat.color }}
                />
            </div>
        </motion.div>
    );
}

function SkillCategory({ skill, index }: { skill: typeof SKILLS[0]; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="space-y-3"
        >
            <h4 className="text-sm font-medium text-white/60 tracking-wider uppercase">
                {skill.category}
            </h4>
            <div className="flex flex-wrap gap-2">
                {skill.items.map((item, i) => (
                    <span
                        key={item}
                        className="px-3 py-1.5 text-xs sm:text-sm bg-white/5 border border-white/10 rounded-full text-white/50 hover:text-cyan-400 hover:border-cyan-400/30 transition-all duration-300"
                    >
                        {item}
                    </span>
                ))}
            </div>
        </motion.div>
    );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(contentRef, { once: true, margin: '-100px' });

    return (
        <section
            ref={sectionRef}
            id="about"

            className="
        relative content-section
        z-10 
        w-full              /* Full width */
        min-h-screen        /* Minimum full viewport height */
        min-h-[100dvh]      /* Dynamic viewport for mobile */
        py-24 sm:py-32 lg:py-40  /* Vertical padding */
      "
        >

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header - Centered */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 sm:mb-20"
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-cyan-400/50" />
                        <span className="text-[0.65rem] sm:text-xs tracking-[0.3em] uppercase text-cyan-400/70">
                            About Me
                        </span>
                        <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-cyan-400/50" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                        The Mind <span className="gradient-text">Behind</span>
                        <br />
                        <span className="text-white/90">the Pixels</span>
                    </h2>
                </motion.div>

                {/* Main Content Grid */}
                <div ref={contentRef} className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20 sm:mb-24">
                    {/* Left Column - Bio */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <p className="text-lg sm:text-xl text-white/70 leading-relaxed">
                            I'm a{' '}
                            <span className="text-cyan-400 font-medium">creative developer</span>{' '}
                            passionate about pushing the boundaries of what's possible on the web.
                            My work lives at the intersection of{' '}
                            <span className="text-purple-400">design engineering</span> and{' '}
                            <span className="text-pink-400">digital art</span>.
                        </p>

                        <p className="text-base sm:text-lg text-white/50 leading-relaxed">
                            With expertise in Three.js, WebGL, and modern frontend frameworks,
                            I craft immersive digital experiences that feel alive. Every project
                            is an opportunity to create something extraordinary.
                        </p>

                        <p className="text-base sm:text-lg text-white/50 leading-relaxed">
                            When I'm not coding, you'll find me exploring generative art,
                            experimenting with shaders, or designing the next interface
                            that feels like it's from the future.
                        </p>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="pt-4"
                        >
                            <a
                                href="/resume.pdf"
                                className="inline-flex items-center gap-3 text-sm text-cyan-400/70 hover:text-cyan-400 transition-colors group"
                            >
                                <span className="tracking-wider uppercase">Download Resume</span>
                                <svg
                                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* Right Column - Skills */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <h3 className="text-lg font-semibold text-white/80 mb-6">
                            Tech Stack & Skills
                        </h3>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {SKILLS.map((skill, i) => (
                                <SkillCategory key={skill.category} skill={skill} index={i} />
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Stats Grid - Centered */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {STATS.map((stat, i) => (
                            <StatCard key={stat.label} stat={stat} index={i} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}