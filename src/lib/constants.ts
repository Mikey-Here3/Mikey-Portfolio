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
    id: 'project-1',
    title: 'NEBULA OS',
    subtitle: 'Operating System Concept',
    description:
      'A futuristic operating system interface designed for the next generation of spatial computing. Features dynamic window management, 3D file navigation, and neural-responsive UI elements.',
    tags: ['UI/UX', 'React', 'Three.js', 'WebGL'],
    color: '#00f0ff',
    image: '/projects/nebula.jpg',
    link: '#',
    year: '2025',
  },
  {
    id: 'project-2',
    title: 'SYNTH WAVE',
    subtitle: 'Music Visualizer',
    description:
      'Real-time audio-reactive 3D visualization engine. Transforms sound frequencies into mesmerizing geometric landscapes with custom shader effects and particle systems.',
    tags: ['WebAudio', 'GLSL', 'Three.js', 'Creative'],
    color: '#b44aff',
    image: '/projects/synth.jpg',
    link: '#',
    year: '2025',
  },
  {
    id: 'project-3',
    title: 'QUANTUM VAULT',
    subtitle: 'Crypto Dashboard',
    description:
      'A premium cryptocurrency portfolio tracker with real-time 3D data visualization, predictive analytics, and an interface inspired by sci-fi command centers.',
    tags: ['FinTech', 'D3.js', 'Next.js', 'API'],
    color: '#ff2d8a',
    image: '/projects/quantum.jpg',
    link: '#',
    year: '2024',
  },
  {
    id: 'project-4',
    title: 'HOLOGRAM AI',
    subtitle: 'AI Assistant Interface',
    description:
      'Conversational AI interface featuring holographic-style 3D avatars, spatial audio, and gesture recognition. Built for immersive human-computer interaction.',
    tags: ['AI/ML', 'WebRTC', 'Three.js', 'Voice'],
    color: '#3d5aff',
    image: '/projects/hologram.jpg',
    link: '#',
    year: '2024',
  },
];

// ===== NAVIGATION =====
export const NAV_ITEMS = [
  { label: 'Home', href: '#hero' },
  { label: 'Work', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
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
  { label: 'GitHub', href: 'https://github.com', icon: 'github' },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
  { label: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
  { label: 'Dribbble', href: 'https://dribbble.com', icon: 'dribbble' },
];
