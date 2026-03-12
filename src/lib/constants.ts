// ===== PROJECT DATA =====
export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  color: string;
  image: string;
  link: string;
  year: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'stockpilot',
    title: 'STOCKPILOT PRO',
    subtitle: 'Inventory Management System',
    description:
      'A comprehensive inventory management platform for businesses to track stock availability, monitor low stock alerts, analyze revenue metrics, and streamline stock operations with real-time analytics dashboard.',
    tags: ['Next.js', 'React', 'TailwindCSS', 'Analytics'],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
    color: '#00f0ff',
    link: 'https://stockpilot-pro.vercel.app/',
    year: '2025',
  },
  {
    id: 'studyhouse-numl',
    title: 'STUDYHOUSE NUML',
    subtitle: 'Academic Resource Portal',
    description:
      'An academic wireframe platform for NUML university students featuring past exam papers, previous year questions, midterm and end-term exam resources organized by courses and semesters.',
    tags: ['Next.js', 'React', 'MongoDB', 'TailwindCSS'],
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    color: '#b44aff',
    link: 'https://studyhouse-eight.vercel.app/',
    year: '2025',
  },
  {
    id: 'solevault',
    title: 'SOLEVAULT',
    subtitle: 'Premium Shoe Store',
    description:
      'A premium multi-brand shoe e-commerce platform with advanced filtering, seamless checkout experience, user authentication, and a curated collection from top footwear brands worldwide.',
    tags: ['Next.js', 'Stripe', 'Auth.js', 'PostgreSQL'],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    color: '#ff2d8a',
    link: 'https://solevault-final.vercel.app/',
    year: '2024',
  },
  {
    id: 'studyhouse',
    title: 'STUDYHOUSE',
    subtitle: 'University Learning Platform',
    description:
      'A comprehensive educational platform where students can access course notes, quizzes, important topics, past midterm and end-term exams across multiple universities and degrees. Features user uploads and community contributions.',
    tags: ['Next.js', 'React', 'Auth.js', 'Cloud Storage'],
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
    color: '#00ff88',
    link: 'https://studyhouse.online/',
    year: '2025',
  },
  {
    id: 'studyhouse-platform',
    title: 'STUDYHOUSE PLATFORM',
    subtitle: 'Full-Stack Academic Resource System',
    description:
      'A full-stack academic resource repository for university students to upload, browse, preview and download past papers. Features role-based admin moderation, PDF preview, Cloudinary storage, JWT auth, ratings, bookmarks, and comments.',
    tags: ['Next.js', 'Node.js', 'PostgreSQL', 'Cloudinary'],
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
    color: '#f5a623',
    link: 'https://www.studyhouse.online/',
    year: '2025',
  },
];

// ===== NAVIGATION =====
export const NAV_ITEMS = [
  { label: 'Home',    href: '#hero'     },
  { label: 'Work',    href: '#projects' },
  { label: 'About',   href: '#about'    },
  { label: 'Contact', href: '#contact'  },
];

// ===== SKILLS =====
export const SKILLS = [
  'React / Next.js',
  'Three.js / R3F',
  'GSAP / Framer Motion',
  'TypeScript',
  'Node.js',
  'WebGL / GLSL',
  'UI/UX Design',
  'Creative Development',
];

// ===== SOCIAL LINKS =====
export const SOCIALS = [
  { label: 'GitHub',   href: 'https://github.com',   icon: 'github'   },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
  { label: 'Twitter',  href: 'https://twitter.com',  icon: 'twitter'  },
  { label: 'Dribbble', href: 'https://dribbble.com', icon: 'dribbble' },
];
