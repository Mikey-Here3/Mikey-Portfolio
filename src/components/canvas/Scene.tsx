'use client';

import { Suspense, useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Preload, AdaptiveDpr, AdaptiveEvents, Html } from '@react-three/drei';
import * as THREE from 'three';
import EnergyCore from './EnergyCore';
import Particles from './Particles';
import PostProcessing from './PostProcessing';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useMobile } from '@/hooks/useMobile';

/**
 * Scene
 * Main 3D scene wrapper with professional-grade optimizations.
 * 
 * Features:
 * - Adaptive DPR and performance scaling
 * - Smooth camera parallax with scroll integration
 * - Dynamic fog and lighting
 * - Graceful loading states
 * - Memory-efficient cleanup
 * - Mobile-optimized rendering
 */

// ==========================================
// TYPES & INTERFACES
// ==========================================

interface SceneProps {
    /** Enable debug mode */
    debug?: boolean;
    /** Quality override */
    quality?: 'low' | 'medium' | 'high';
    /** Custom color theme */
    colors?: {
        primary?: string;
        secondary?: string;
        accent?: string;
        fog?: string;
    };
}

interface FloatingObjectConfig {
    position: [number, number, number];
    scale: number;
    color: string;
    rotationSpeed: [number, number, number];
    floatSpeed: number;
    floatAmplitude: number;
    geometry: 'octahedron' | 'tetrahedron' | 'icosahedron';
}

// ==========================================
// CONSTANTS
// ==========================================

const DEFAULT_COLORS = {
    primary: '#00f0ff',
    secondary: '#b44aff',
    accent: '#ff2d8a',
    fog: '#050510',
};

const CAMERA_CONFIG = {
    fov: 60,
    near: 0.1,
    far: 100,
    initialZ: 6,
    maxScrollZ: 20,
    mouseInfluenceX: 0.4,
    mouseInfluenceY: 0.25,
    lerpSpeed: 0.04,
};

const FADE_CONFIG = {
    start: 0.08,
    end: 0.3,
    minScale: 0.5,
};

// ==========================================
// LOADING COMPONENT
// ==========================================

function SceneLoader() {
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="relative w-16 h-16">
                    {/* Outer ring */}
                    <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full animate-ping" />
                    {/* Inner spinner */}
                    <div className="absolute inset-2 border-2 border-transparent border-t-cyan-400 rounded-full animate-spin" />
                    {/* Core dot */}
                    <div className="absolute inset-6 bg-cyan-400 rounded-full animate-pulse" />
                </div>
                <div className="text-cyan-400 text-sm font-mono tracking-wider animate-pulse">
                    INITIALIZING...
                </div>
            </div>
        </Html>
    );
}

// ==========================================
// CAMERA CONTROLLER
// ==========================================

/**
 * CameraController
 * Handles mouse-driven camera movement with smooth inertia.
 * Pulls camera AWAY from the core as user scrolls.
 */
function CameraController({ debug = false }: { debug?: boolean }) {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const mouse = useMousePosition();
    const scrollProgress = useScrollProgress();

    // Use refs for smooth interpolation without re-renders
    const targetPos = useRef(new THREE.Vector3(0, 0, CAMERA_CONFIG.initialZ));
    const currentPos = useRef(new THREE.Vector3(0, 0, CAMERA_CONFIG.initialZ));
    const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));

    useFrame((state, delta) => {
        if (!cameraRef.current) return;

        // Mouse-driven camera offset (subtle parallax)
        const mouseOffsetX = mouse.normalizedX * CAMERA_CONFIG.mouseInfluenceX;
        const mouseOffsetY = mouse.normalizedY * CAMERA_CONFIG.mouseInfluenceY;

        // Scroll-based camera positioning
        const scrollZ = CAMERA_CONFIG.initialZ + scrollProgress * (CAMERA_CONFIG.maxScrollZ - CAMERA_CONFIG.initialZ);
        const scrollY = scrollProgress * 5;

        // Set target position
        targetPos.current.set(mouseOffsetX, scrollY + mouseOffsetY, scrollZ);

        // Frame-rate independent lerp
        const lerpFactor = 1 - Math.pow(0.001, delta * CAMERA_CONFIG.lerpSpeed * 60);
        currentPos.current.lerp(targetPos.current, lerpFactor);

        // Apply position
        cameraRef.current.position.copy(currentPos.current);

        // Smooth look-at target
        lookAtTarget.current.set(0, scrollProgress * 2, 0);
        cameraRef.current.lookAt(lookAtTarget.current);

        // Debug logging
        if (debug && state.clock.elapsedTime % 2 < 0.02) {
            console.log('Camera:', {
                position: currentPos.current.toArray().map(v => v.toFixed(2)),
                scroll: scrollProgress.toFixed(2),
            });
        }
    });

    return (
        <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            position={[0, 0, CAMERA_CONFIG.initialZ]}
            fov={CAMERA_CONFIG.fov}
            near={CAMERA_CONFIG.near}
            far={CAMERA_CONFIG.far}
        />
    );
}

// ==========================================
// FLOATING OBJECTS
// ==========================================

/**
 * FloatingObjects
 * Decorative 3D objects that float in the background.
 * Optimized with instanced rendering considerations.
 */
function FloatingObjects({
    colors = DEFAULT_COLORS,
    quality = 'high'
}: {
    colors?: typeof DEFAULT_COLORS;
    quality?: 'low' | 'medium' | 'high';
}) {
    const groupRef = useRef<THREE.Group>(null);
    const scrollProgress = useScrollProgress();

    // Object configurations with varied properties
    const objects = useMemo<FloatingObjectConfig[]>(() => {
        const baseObjects: FloatingObjectConfig[] = [
            {
                position: [-5, 2, -3],
                scale: 0.3,
                color: colors.primary,
                rotationSpeed: [0.002, 0.003, 0.001],
                floatSpeed: 0.3,
                floatAmplitude: 0.002,
                geometry: 'octahedron'
            },
            {
                position: [4, -1, -5],
                scale: 0.2,
                color: colors.secondary,
                rotationSpeed: [0.003, 0.002, 0.002],
                floatSpeed: 0.4,
                floatAmplitude: 0.003,
                geometry: 'tetrahedron'
            },
            {
                position: [-3, -3, -4],
                scale: 0.15,
                color: colors.accent,
                rotationSpeed: [0.001, 0.004, 0.002],
                floatSpeed: 0.35,
                floatAmplitude: 0.0025,
                geometry: 'icosahedron'
            },
            {
                position: [6, 3, -6],
                scale: 0.25,
                color: '#3d5aff',
                rotationSpeed: [0.002, 0.002, 0.003],
                floatSpeed: 0.25,
                floatAmplitude: 0.002,
                geometry: 'octahedron'
            },
            {
                position: [-6, -2, -8],
                scale: 0.35,
                color: colors.primary,
                rotationSpeed: [0.003, 0.001, 0.002],
                floatSpeed: 0.2,
                floatAmplitude: 0.0015,
                geometry: 'tetrahedron'
            },
            {
                position: [3, 4, -7],
                scale: 0.18,
                color: colors.secondary,
                rotationSpeed: [0.001, 0.003, 0.001],
                floatSpeed: 0.45,
                floatAmplitude: 0.003,
                geometry: 'icosahedron'
            },
        ];

        // Reduce objects on lower quality
        if (quality === 'low') return baseObjects.slice(0, 3);
        if (quality === 'medium') return baseObjects.slice(0, 4);
        return baseObjects;
    }, [colors, quality]);

    // Store initial Y positions for float animation
    const initialYPositions = useRef<number[]>([]);

    useEffect(() => {
        initialYPositions.current = objects.map(obj => obj.position[1]);
    }, [objects]);

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        const time = state.clock.elapsedTime;

        // Fade objects based on scroll
        const fadeOpacity = Math.max(0, 1 - scrollProgress * 2);

        groupRef.current.children.forEach((child, i) => {
            const config = objects[i];
            if (!config) return;

            const mesh = child as THREE.Mesh;
            const initialY = initialYPositions.current[i] ?? config.position[1];

            // Float animation
            mesh.position.y = initialY + Math.sin(time * config.floatSpeed + i * 1.5) * config.floatAmplitude * 100;

            // Rotation with frame-rate independence
            mesh.rotation.x += config.rotationSpeed[0] * delta * 60;
            mesh.rotation.y += config.rotationSpeed[1] * delta * 60;
            mesh.rotation.z += config.rotationSpeed[2] * delta * 60;

            // Update opacity based on scroll
            const material = mesh.material as THREE.MeshBasicMaterial;
            if (material.opacity !== undefined) {
                material.opacity = 0.3 * fadeOpacity;
            }
        });
    });

    // Geometry factory
    const getGeometry = useCallback((type: FloatingObjectConfig['geometry']) => {
        switch (type) {
            case 'tetrahedron':
                return <tetrahedronGeometry args={[1, 0]} />;
            case 'icosahedron':
                return <icosahedronGeometry args={[1, 0]} />;
            case 'octahedron':
            default:
                return <octahedronGeometry args={[1, 0]} />;
        }
    }, []);

    return (
        <group ref={groupRef}>
            {objects.map((obj, i) => (
                <mesh key={i} position={obj.position} scale={obj.scale}>
                    {getGeometry(obj.geometry)}
                    <meshBasicMaterial
                        color={obj.color}
                        wireframe
                        transparent
                        opacity={0.3}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}
        </group>
    );
}

// ==========================================
// DYNAMIC LIGHTING
// ==========================================

/**
 * DynamicLighting
 * Reactive lighting system that responds to scroll and mouse.
 */
function DynamicLighting({
    colors = DEFAULT_COLORS,
    scrollProgress
}: {
    colors?: typeof DEFAULT_COLORS;
    scrollProgress: number;
}) {
    const directionalRef = useRef<THREE.DirectionalLight>(null);
    const pointRef = useRef<THREE.PointLight>(null);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Animate directional light position
        if (directionalRef.current) {
            directionalRef.current.position.x = Math.sin(time * 0.2) * 5;
            directionalRef.current.position.z = Math.cos(time * 0.2) * 5;
            directionalRef.current.intensity = 0.3 * (1 - scrollProgress * 0.5);
        }

        // Pulse point light
        if (pointRef.current) {
            pointRef.current.intensity = 0.5 + Math.sin(time * 2) * 0.2;
        }
    });

    return (
        <>
            <ambientLight intensity={0.08} color="#ffffff" />
            <directionalLight
                ref={directionalRef}
                position={[5, 5, 5]}
                intensity={0.3}
                color={colors.secondary}
            />
            <pointLight
                ref={pointRef}
                position={[0, 0, 3]}
                intensity={0.5}
                color={colors.primary}
                distance={15}
                decay={2}
            />
        </>
    );
}

// ==========================================
// SCENE CONTENT
// ==========================================

/**
 * SceneContent
 * Inner component that can use R3F hooks.
 * Handles fading the energy core based on scroll.
 */
function SceneContent({
    isMobile,
    debug = false,
    quality,
    colors = DEFAULT_COLORS,
}: {
    isMobile: boolean;
    debug?: boolean;
    quality?: 'low' | 'medium' | 'high';
    colors?: typeof DEFAULT_COLORS;
}) {
    const mouse = useMousePosition();
    const scrollProgress = useScrollProgress();
    const coreGroupRef = useRef<THREE.Group>(null);
    const { gl } = useThree();

    // Memoize quality based on device
    const effectiveQuality = useMemo(() => {
        if (quality) return quality;
        if (isMobile) return 'low';
        const pixelRatio = gl.getPixelRatio();
        if (pixelRatio < 1.5) return 'low';
        if (pixelRatio < 2) return 'medium';
        return 'high';
    }, [quality, isMobile, gl]);

    // Store base opacities to avoid recalculation
    const baseOpacities = useRef(new Map<THREE.Material, number>());

    // Fade energy core as user scrolls past hero section
    useFrame(() => {
        if (!coreGroupRef.current) return;

        // Calculate fade opacity
        const opacity = scrollProgress < FADE_CONFIG.start
            ? 1
            : scrollProgress > FADE_CONFIG.end
                ? 0
                : 1 - (scrollProgress - FADE_CONFIG.start) / (FADE_CONFIG.end - FADE_CONFIG.start);

        // Early exit if invisible
        const isVisible = opacity > 0.01;
        coreGroupRef.current.visible = isVisible;

        if (!isVisible) return;

        // Scale down as it fades
        const scale = FADE_CONFIG.minScale + opacity * (1 - FADE_CONFIG.minScale);
        coreGroupRef.current.scale.setScalar(scale);

        // Update material opacities
        coreGroupRef.current.traverse((child) => {
            const mesh = child as THREE.Mesh;
            if (!mesh.material) return;

            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

            materials.forEach((mat) => {
                if (!('opacity' in mat)) return;

                // Store base opacity on first encounter
                if (!baseOpacities.current.has(mat)) {
                    baseOpacities.current.set(mat, mat.opacity);
                }

                const baseOpacity = baseOpacities.current.get(mat) ?? mat.opacity;
                mat.opacity = baseOpacity * opacity;
                mat.transparent = true;
                mat.needsUpdate = true;
            });
        });
    });

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            baseOpacities.current.clear();
        };
    }, []);

    // Particle count based on quality
    const particleCount = useMemo(() => {
        switch (effectiveQuality) {
            case 'low': return 600;
            case 'medium': return 1200;
            case 'high': return 2000;
            default: return 1200;
        }
    }, [effectiveQuality]);

    return (
        <>
            <CameraController debug={debug} />

            <DynamicLighting
                colors={colors}
                scrollProgress={scrollProgress}
            />

            {/* Fog for depth */}
            <fog attach="fog" args={[colors.fog, 8, 45]} />

            {/* Energy Core — wrapped in a group for scroll-based fading */}
            <group ref={coreGroupRef}>
                <EnergyCore
                    mouseX={mouse.normalizedX}
                    mouseY={mouse.normalizedY}
                    quality={effectiveQuality === 'low' ? 'low' : 'high'}
                    colors={{
                        primary: colors.primary,
                        secondary: colors.secondary,
                        accent: colors.accent,
                    }}
                />
            </group>

            {/* Background particles */}
            <Particles
                count={particleCount}
                mouseX={mouse.normalizedX}
                mouseY={mouse.normalizedY}
                quality={effectiveQuality}
                colors={{
                    primary: colors.primary,
                    secondary: colors.secondary,
                    tertiary: colors.accent,
                }}
                interactive={!isMobile}
            />

            {/* Floating decorative objects */}
            <FloatingObjects
                colors={colors}
                quality={effectiveQuality}
            />

            {/* Post-processing effects */}
            <PostProcessing
                quality={effectiveQuality === 'low' ? 'low' : effectiveQuality === 'medium' ? 'medium' : 'high'}
                enableNoise={effectiveQuality === 'high'}
                enableAberration={effectiveQuality !== 'low'}
                animated={!isMobile}
                mouseX={mouse.normalizedX}
                mouseY={mouse.normalizedY}
            />

            {/* Preload assets */}
            <Preload all />
        </>
    );
}

// ==========================================
// ERROR BOUNDARY
// ==========================================

function SceneErrorFallback() {
    return (
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#050510] to-[#0a0a20] flex items-center justify-center">
            <div className="text-center text-cyan-400/50">
                <div className="text-6xl mb-4">⚡</div>
                <p className="font-mono text-sm">WebGL not supported</p>
            </div>
        </div>
    );
}

// ==========================================
// MAIN SCENE COMPONENT
// ==========================================

/**
 * Scene
 * Main 3D scene wrapper. Fixed behind all content.
 */
export default function Scene({
    debug = false,
    quality,
    colors,
}: SceneProps = {}) {
    const isMobile = useMobile();
    const [hasWebGL, setHasWebGL] = useState(true);
    const [isClient, setIsClient] = useState(false);

    // Check WebGL support and ensure client-side rendering
    useEffect(() => {
        setIsClient(true);

        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
            setHasWebGL(!!gl);
        } catch {
            setHasWebGL(false);
        }
    }, []);

    // Merged colors with defaults
    const mergedColors = useMemo(() => ({
        ...DEFAULT_COLORS,
        ...colors,
    }), [colors]);

    // Don't render on server
    if (!isClient) {
        return (
            <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#050510] to-[#0a0a20]" />
        );
    }

    // Fallback for no WebGL
    if (!hasWebGL) {
        return <SceneErrorFallback />;
    }

    return (
        <div
            className="fixed inset-0 z-0"
            style={{
                background: `linear-gradient(to bottom, ${mergedColors.fog}, #0a0a20)`
            }}
        >
            <Canvas
                gl={{
                    antialias: !isMobile,
                    alpha: true,
                    stencil: false,
                    depth: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2,
                    powerPreference: isMobile ? 'low-power' : 'high-performance',
                    failIfMajorPerformanceCaveat: false,
                }}
                dpr={isMobile ? [1, 1.5] : [1, 2]}
                performance={{ min: 0.5 }}
                shadows={false}
                flat={isMobile}
                frameloop="always"
                resize={{ scroll: false, debounce: { scroll: 50, resize: 100 } }}
            >
                {/* Adaptive performance */}
                <AdaptiveDpr pixelated />
                <AdaptiveEvents />

                <Suspense fallback={<SceneLoader />}>
                    <SceneContent
                        isMobile={isMobile}
                        debug={debug}
                        quality={quality}
                        colors={mergedColors}
                    />
                </Suspense>
            </Canvas>

            {/* Debug overlay */}
            {debug && (
                <div className="absolute top-4 left-4 text-xs font-mono text-cyan-400/50 pointer-events-none">
                    <div>Quality: {quality ?? 'auto'}</div>
                    <div>Mobile: {isMobile ? 'yes' : 'no'}</div>
                </div>
            )}
        </div>
    );
}

// Named export
export { Scene };