'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

// ==========================================
// TYPES & CONSTANTS
// ==========================================

interface Project {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    tags: string[];
    image: string;
    color: string;
    link?: string;
    github?: string;
}

const PROJECTS: Project[] = [
    {
        id: 'stockpilot',
        title: 'STOCKPILOT PRO',
        subtitle: 'Inventory Management System',
        description: 'A comprehensive inventory management platform for businesses to track stock availability, monitor low stock alerts, analyze revenue metrics, and streamline stock operations with real-time analytics dashboard.',
        tags: ['Next.js', 'React', 'TailwindCSS', 'Analytics'],
        image: '/projects/stockpilot.jpg',
        color: '#00f0ff',
        link: 'https://stockpilot-pro.vercel.app/',
    },
    {
        id: 'studyhouse-numl',
        title: 'STUDYHOUSE NUML',
        subtitle: 'Academic Resource Portal',
        description: 'An academic wireframe platform for NUML university students featuring past exam papers, previous year questions, midterm and end-term exam resources organized by courses and semesters.',
        tags: ['Next.js', 'React', 'MongoDB', 'TailwindCSS'],
        image: '/projects/studyhouse-numl.jpg',
        color: '#b44aff',
        link: 'https://studyhouse-eight.vercel.app/',
    },
    {
        id: 'solevault',
        title: 'SOLEVAULT',
        subtitle: 'Premium Shoe Store',
        description: 'A premium multi-brand shoe e-commerce platform with advanced filtering, seamless checkout experience, user authentication, and a curated collection from top footwear brands worldwide.',
        tags: ['Next.js', 'Stripe', 'Auth.js', 'PostgreSQL'],
        image: '/projects/solevault.jpg',
        color: '#ff2d8a',
        link: 'https://solevault-final.vercel.app/',
    },
    {
        id: 'studyhouse',
        title: 'STUDYHOUSE',
        subtitle: 'University Learning Platform',
        description: 'A comprehensive educational platform where students can access course notes, quizzes, important topics, past midterm and end-term exams across multiple universities and degrees. Features user uploads and community contributions.',
        tags: ['Next.js', 'React', 'Auth.js', 'Cloud Storage'],
        image: '/projects/studyhouse.jpg',
        color: '#00ff88',
        link: 'https://studyhouse.online/',
    },
];

// ==========================================
// SUB-COMPONENTS
// ==========================================

function ProjectCard({ project, index }: { project: Project; index: number }) {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative"
        >
            <div className="relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-500">
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden">
                    {/* Placeholder gradient background */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(135deg, ${project.color}15 0%, rgba(5,5,16,0.8) 50%, ${project.color}10 100%)`,
                        }}
                    />

                    {/* Decorative pattern */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `radial-gradient(${project.color}40 1px, transparent 1px)`,
                            backgroundSize: '20px 20px',
                        }}
                    />

                    {/* Project icon/logo placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                            style={{
                                backgroundColor: `${project.color}20`,
                                color: project.color,
                                border: `1px solid ${project.color}30`,
                            }}
                        >
                            {project.title.charAt(0)}
                        </div>
                    </div>

                    {/* Bottom gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent z-10" />

                    {/* Hover glow effect */}
                    <motion.div
                        className="absolute inset-0 z-20 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            background: `radial-gradient(circle at center, ${project.color}25 0%, transparent 70%)`,
                        }}
                    />

                    {/* Live badge */}
                    <div className="absolute top-4 right-4 z-30">
                        <span
                            className="px-2.5 py-1 text-[0.6rem] tracking-wider uppercase rounded-full font-medium"
                            style={{
                                backgroundColor: `${project.color}20`,
                                color: project.color,
                                border: `1px solid ${project.color}40`,
                            }}
                        >
                            Live
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                    {/* Subtitle */}
                    <span
                        className="text-[0.65rem] tracking-[0.2em] uppercase font-medium"
                        style={{ color: project.color }}
                    >
                        {project.subtitle}
                    </span>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold mt-2 mb-3 text-white/90 group-hover:text-white transition-colors">
                        {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-white/40 leading-relaxed mb-5 line-clamp-3">
                        {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2.5 py-1 text-[0.6rem] tracking-wider uppercase bg-white/5 border border-white/10 rounded-full text-white/50 hover:text-white/70 hover:border-white/20 transition-colors"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-4">
                        {project.link && (
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-white/50 hover:text-cyan-400 transition-colors group/link"
                            >
                                <span>View Live</span>
                                <svg
                                    className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        )}
                        {project.github && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-white/50 hover:text-white transition-colors"
                            >
                                <span>Source</span>
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>

                {/* Corner accent on hover */}
                <div
                    className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        background: `linear-gradient(135deg, transparent 50%, ${project.color}15 50%)`,
                    }}
                />

                {/* Bottom border glow on hover */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`,
                    }}
                />
            </div>
        </motion.div>
    );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function Projects() {
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section
            ref={sectionRef}
            id="projects"
            className="content-section relative z-10 w-full py-24 sm:py-32 lg:py-40"
        >
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 sm:mb-20"
                >
                    {/* Label */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-purple-400/50" />
                        <span className="text-[0.65rem] sm:text-xs tracking-[0.3em] uppercase text-purple-400/70">
                            Selected Work
                        </span>
                        <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-purple-400/50" />
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
                        Featured <span className="gradient-text">Projects</span>
                    </h2>

                    {/* Description */}
                    <p className="text-base sm:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
                        A collection of real-world applications spanning inventory management,
                        e-commerce platforms, and educational resources.
                    </p>
                </motion.div>

                {/* Projects Grid */}
                <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                    {PROJECTS.map((project, i) => (
                        <ProjectCard key={project.id} project={project} index={i} />
                    ))}
                </div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="mt-16 sm:mt-20"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {[
                            { value: '4+', label: 'Live Projects', color: '#00f0ff' },
                            { value: '100%', label: 'Responsive', color: '#b44aff' },
                            { value: 'Full', label: 'Stack Dev', color: '#ff2d8a' },
                            { value: '24/7', label: 'Deployed', color: '#00ff88' },
                        ].map((stat, i) => (
                            <div
                                key={stat.label}
                                className="text-center p-4 sm:p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                            >
                                <div
                                    className="text-2xl sm:text-3xl font-bold mb-1"
                                    style={{ color: stat.color }}
                                >
                                    {stat.value}
                                </div>
                                <div className="text-[0.65rem] sm:text-xs tracking-wider uppercase text-white/30">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-center mt-12 sm:mt-16"
                >
                    <a
                        href="https://github.com/Mikey-Here3"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-6 py-3 text-sm tracking-wider uppercase text-white/50 hover:text-white border border-white/10 hover:border-white/30 rounded-full transition-all duration-300 group"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        <span>View More on GitHub</span>
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
            </div>
        </section>
    );
}
