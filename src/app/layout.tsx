import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// ==========================================
// FONT CONFIGURATION
// ==========================================

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

// ==========================================
// SITE CONFIGURATION
// ==========================================

const siteConfig = {
  name: 'MIKEY',
  title: 'MIKEY — Creative Developer & Digital Artisan',
  description: 'Immersive 3D portfolio showcasing creative development, futuristic interfaces, and digital artistry. Specializing in Three.js, WebGL, React, and cutting-edge web experiences.',
  url: 'https://mikey.dev',
  ogImage: '/og-image.jpg',
  twitterHandle: '@mikey',
  locale: 'en_US',
};

// ==========================================
// METADATA
// ==========================================

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'creative developer',
    'portfolio',
    '3D web',
    'Three.js',
    'WebGL',
    'React',
    'Next.js',
    'GSAP',
    'interactive design',
    'futuristic interfaces',
    'digital artisan',
    'web developer',
    'frontend developer',
    'creative technologist',
    'immersive experiences',
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [{ rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#00f0ff' }],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Creative Developer Portfolio`,
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  applicationName: siteConfig.name,
  referrer: 'origin-when-cross-origin',
  category: 'technology',
};

// ==========================================
// VIEWPORT
// ==========================================

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#050510' },
    { media: '(prefers-color-scheme: dark)', color: '#050510' },
  ],
  colorScheme: 'dark',
  viewportFit: 'cover',
};

// ==========================================
// STRUCTURED DATA
// ==========================================

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.name,
  url: siteConfig.url,
  image: `${siteConfig.url}${siteConfig.ogImage}`,
  jobTitle: 'Creative Developer & Digital Artisan',
  description: siteConfig.description,
  sameAs: [
    'https://github.com/mikey',
    'https://linkedin.com/in/mikey',
    'https://twitter.com/mikey',
    'https://dribbble.com/mikey',
  ],
};

// ==========================================
// ROOT LAYOUT
// ==========================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={inter.variable}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      <body
        className={`${inter.className} antialiased bg-[#050510] text-white`}
        suppressHydrationWarning
      >
        {/* Skip link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2 focus:bg-cyan-400 focus:text-black focus:rounded-lg focus:outline-none"
        >
          Skip to main content
        </a>

        {/* 
          FIXED: Root wrapper now uses full width
          - w-full ensures 100% width
          - min-w-0 prevents flex overflow issues
          - overflow-x-hidden prevents horizontal scroll
        */}
        <div
          id="main-content"
          className="relative w-full min-w-0 min-h-screen min-h-[100dvh] overflow-x-hidden"
        >
          {children}
        </div>

        {/* Noscript fallback */}
        <noscript>
          <div className="fixed inset-0 flex items-center justify-center bg-[#050510] text-white p-8 text-center z-[99999]">
            <div className="max-w-md">
              <h1 className="text-2xl font-bold mb-4">JavaScript Required</h1>
              <p className="text-white/60">
                This portfolio requires JavaScript to display properly.
                Please enable JavaScript in your browser settings.
              </p>
            </div>
          </div>
        </noscript>
      </body>
    </html>
  );
}