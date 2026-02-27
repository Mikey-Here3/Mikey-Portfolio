'use client';

import { useRef, useMemo, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Particles System
 * Creates a cosmic background field of particles that react to mouse position.
 * Uses instanced geometry for optimal performance.
 * Each particle has random position, size, and drift velocity.
 * 
 * Optimizations:
 * - Device-adaptive particle count
 * - GPU-based animations (no CPU size updates per frame)
 * - Efficient memory management with proper cleanup
 * - Configurable distribution patterns
 */

interface ParticlesProps {
    /** Base particle count (auto-adjusted for mobile) */
    count?: number;
    /** Mouse position for interactive effects */
    mouseX?: number;
    mouseY?: number;
    /** Distribution pattern */
    pattern?: 'sphere' | 'galaxy' | 'cube' | 'cylinder';
    /** Color theme */
    colors?: {
        primary?: string;
        secondary?: string;
        tertiary?: string;
    };
    /** Particle size multiplier */
    sizeScale?: number;
    /** Animation speed multiplier */
    speed?: number;
    /** Enable mouse interaction */
    interactive?: boolean;
    /** Quality preset */
    quality?: 'low' | 'medium' | 'high';
}

// Device detection hook
const useAdaptiveCount = (baseCount: number, quality?: 'low' | 'medium' | 'high'): number => {
    const { gl } = useThree();

    return useMemo(() => {
        if (quality === 'low') return Math.floor(baseCount * 0.3);
        if (quality === 'medium') return Math.floor(baseCount * 0.6);
        if (quality === 'high') return baseCount;

        const isMobile = typeof window !== 'undefined' &&
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const pixelRatio = gl.getPixelRatio();

        if (isMobile || pixelRatio < 1.5) return Math.floor(baseCount * 0.3);
        if (pixelRatio < 2) return Math.floor(baseCount * 0.6);
        return baseCount;
    }, [baseCount, quality, gl]);
};

// Distribution pattern generators
const generatePositions = (
    count: number,
    pattern: ParticlesProps['pattern'] = 'sphere'
): { positions: Float32Array; velocities: Float32Array; randoms: Float32Array } => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4); // x: size, y: speed, z: offset, w: brightness

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const i4 = i * 4;

        let x = 0, y = 0, z = 0;

        switch (pattern) {
            case 'galaxy': {
                // Spiral galaxy distribution
                const arm = Math.floor(Math.random() * 3);
                const armAngle = (arm * Math.PI * 2) / 3;
                const distance = 5 + Math.pow(Math.random(), 0.5) * 30;
                const angle = armAngle + (distance * 0.15) + (Math.random() - 0.5) * 0.5;
                const height = (Math.random() - 0.5) * (3 / (1 + distance * 0.1));

                x = Math.cos(angle) * distance;
                y = height * 3;
                z = Math.sin(angle) * distance;
                break;
            }

            case 'cube': {
                // Cubic distribution with density toward edges
                const edge = Math.random() < 0.3;
                const size = 25;
                if (edge) {
                    const face = Math.floor(Math.random() * 6);
                    x = (Math.random() - 0.5) * size * 2;
                    y = (Math.random() - 0.5) * size * 2;
                    z = (Math.random() - 0.5) * size * 2;
                    if (face < 2) x = (face === 0 ? -1 : 1) * size;
                    else if (face < 4) y = (face === 2 ? -1 : 1) * size;
                    else z = (face === 4 ? -1 : 1) * size;
                } else {
                    x = (Math.random() - 0.5) * size * 2;
                    y = (Math.random() - 0.5) * size * 2;
                    z = (Math.random() - 0.5) * size * 2;
                }
                break;
            }

            case 'cylinder': {
                // Cylindrical distribution
                const radius = 10 + Math.random() * 20;
                const theta = Math.random() * Math.PI * 2;
                const height = (Math.random() - 0.5) * 40;

                x = radius * Math.cos(theta);
                y = height;
                z = radius * Math.sin(theta);
                break;
            }

            case 'sphere':
            default: {
                // Spherical distribution (original)
                const radius = 15 + Math.random() * 25;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);

                x = radius * Math.sin(phi) * Math.cos(theta);
                y = radius * Math.sin(phi) * Math.sin(theta);
                z = radius * Math.cos(phi);
                break;
            }
        }

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        // Drift velocities for subtle movement
        velocities[i3] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

        // Random attributes: size, speed, phase offset, brightness
        randoms[i4] = Math.random() * 2 + 0.5;      // size
        randoms[i4 + 1] = Math.random() * 2 + 0.5;  // animation speed
        randoms[i4 + 2] = Math.random() * Math.PI * 2; // phase offset
        randoms[i4 + 3] = Math.random() * 0.5 + 0.5;   // brightness
    }

    return { positions, velocities, randoms };
};

export default function Particles({
    count = 2000,
    mouseX = 0,
    mouseY = 0,
    pattern = 'sphere',
    colors,
    sizeScale = 1,
    speed = 1,
    interactive = true,
    quality
}: ParticlesProps) {
    const meshRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const adaptiveCount = useAdaptiveCount(count, quality);

    // Memoized colors
    const particleColors = useMemo(() => ({
        primary: colors?.primary || '#00f0ff',
        secondary: colors?.secondary || '#b44aff',
        tertiary: colors?.tertiary || '#ff2d8a'
    }), [colors?.primary, colors?.secondary, colors?.tertiary]);

    // Generate particle data
    const { positions, velocities, randoms } = useMemo(
        () => generatePositions(adaptiveCount, pattern),
        [adaptiveCount, pattern]
    );

    // Custom shader material with GPU-based animations
    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uColor1: { value: new THREE.Color(particleColors.primary) },
                uColor2: { value: new THREE.Color(particleColors.secondary) },
                uColor3: { value: new THREE.Color(particleColors.tertiary) },
                uSizeScale: { value: sizeScale },
                uSpeed: { value: speed },
                uInteractive: { value: interactive ? 1.0 : 0.0 },
            },
            vertexShader: `
        attribute vec3 aVelocity;
        attribute vec4 aRandom;
        
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uSizeScale;
        uniform float uSpeed;
        uniform float uInteractive;
        
        varying float vAlpha;
        varying vec3 vColor;
        varying float vBrightness;
        
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        
        void main() {
          // Animate position with velocity and time
          vec3 pos = position;
          float timeOffset = uTime * uSpeed * aRandom.y;
          
          // Orbital drift
          pos += aVelocity * sin(timeOffset + aRandom.z) * 10.0;
          
          // Mouse interaction - particles drift away from cursor
          if (uInteractive > 0.5) {
            vec2 mouseWorld = uMouse * 20.0;
            vec2 toMouse = pos.xy - mouseWorld;
            float mouseDist = length(toMouse);
            float mouseInfluence = smoothstep(15.0, 0.0, mouseDist) * 3.0;
            pos.xy += normalize(toMouse + 0.001) * mouseInfluence;
            pos.z += mouseInfluence * 0.5;
          }
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          
          // Size with shimmer effect (GPU-based)
          float shimmer = 0.7 + 0.3 * sin(timeOffset * 2.0 + aRandom.z);
          float size = aRandom.x * shimmer * uSizeScale;
          gl_PointSize = size * (200.0 / -mvPosition.z);
          gl_PointSize = clamp(gl_PointSize, 1.0, 50.0);
          
          gl_Position = projectionMatrix * mvPosition;
          
          // Depth-based alpha fade
          float depth = length(pos);
          vAlpha = smoothstep(45.0, 10.0, depth);
          
          // Color mixing based on position and randomness
          float yNorm = (pos.y + 25.0) / 50.0;
          float colorMix = yNorm * 0.5 + aRandom.w * 0.5;
          
          if (colorMix < 0.33) {
            vColor = mix(uColor1, uColor2, colorMix * 3.0);
          } else if (colorMix < 0.66) {
            vColor = mix(uColor2, uColor3, (colorMix - 0.33) * 3.0);
          } else {
            vColor = mix(uColor3, uColor1, (colorMix - 0.66) * 3.0);
          }
          
          vBrightness = aRandom.w;
        }
      `,
            fragmentShader: `
        varying float vAlpha;
        varying vec3 vColor;
        varying float vBrightness;
        
        void main() {
          // Round particle with soft edges
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          // Multi-layer glow effect
          float core = 1.0 - smoothstep(0.0, 0.15, dist);
          float glow = 1.0 - smoothstep(0.0, 0.5, dist);
          glow = pow(glow, 1.5);
          
          // Combine core and glow
          float intensity = core * 0.8 + glow * 0.4;
          intensity *= vBrightness;
          
          // Final color with HDR-like bloom simulation
          vec3 finalColor = vColor * intensity;
          finalColor += vColor * core * 0.5; // Extra bright core
          
          float alpha = glow * vAlpha * 0.7;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: false,
        });
    }, [particleColors, sizeScale, speed, interactive]);

    // Store material ref for cleanup
    useEffect(() => {
        materialRef.current = shaderMaterial;
    }, [shaderMaterial]);

    // Update mouse uniform
    useEffect(() => {
        if (shaderMaterial.uniforms.uMouse) {
            shaderMaterial.uniforms.uMouse.value.set(mouseX, mouseY);
        }
    }, [mouseX, mouseY, shaderMaterial]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (materialRef.current) {
                materialRef.current.dispose();
            }
        };
    }, []);

    // Animation loop
    useFrame((state, delta) => {
        const time = state.clock.elapsedTime;

        // Update time uniform
        shaderMaterial.uniforms.uTime.value = time;

        if (meshRef.current) {
            // Slow global rotation for cosmic feel
            meshRef.current.rotation.y += delta * 0.015 * speed;
            meshRef.current.rotation.x = Math.sin(time * 0.01 * speed) * 0.1;
        }
    });

    return (
        <points ref={meshRef} material={shaderMaterial} frustumCulled={false}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                    count={adaptiveCount}
                />
                <bufferAttribute
                    attach="attributes-aVelocity"
                    args={[velocities, 3]}
                    count={adaptiveCount}
                />
                <bufferAttribute
                    attach="attributes-aRandom"
                    args={[randoms, 4]}
                    count={adaptiveCount}
                />
            </bufferGeometry>
        </points>
    );
}

// Named export for selective imports
export { Particles };