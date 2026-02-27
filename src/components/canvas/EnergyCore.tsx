'use client';

import { useRef, useMemo, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * EnergyCore
 * The centerpiece 3D object — a floating energy orb / reactor core.
 * Uses custom shaders for the glowing plasma effect.
 * Responds to mouse position for interactive feel.
 * 
 * Structure:
 * - Inner glowing sphere (plasma core)
 * - Outer wireframe sphere (containment field)
 * - Orbiting ring particles
 * - Dynamic point lights
 * 
 * Optimizations:
 * - Adaptive quality based on device capabilities
 * - Memory-efficient shader uniforms
 * - Proper resource cleanup on unmount
 */

interface EnergyCoreProps {
    mouseX?: number;
    mouseY?: number;
    /** Force quality level: 'low' for mobile, 'high' for desktop */
    quality?: 'low' | 'high';
    /** Enable/disable auto-rotation when idle */
    autoRotate?: boolean;
    /** Color theme override */
    colors?: {
        primary?: string;
        secondary?: string;
        accent?: string;
    };
}

// Detect if device is mobile/low-power
const useDeviceQuality = (): 'low' | 'high' => {
    const { gl } = useThree();
    return useMemo(() => {
        const isMobile = typeof window !== 'undefined' &&
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const pixelRatio = gl.getPixelRatio();
        return isMobile || pixelRatio < 1.5 ? 'low' : 'high';
    }, [gl]);
};

export default function EnergyCore({
    mouseX = 0,
    mouseY = 0,
    quality: forcedQuality,
    autoRotate = true,
    colors
}: EnergyCoreProps) {
    const groupRef = useRef<THREE.Group>(null);
    const coreRef = useRef<THREE.Mesh>(null);
    const wireRef = useRef<THREE.Mesh>(null);
    const ring1Ref = useRef<THREE.Mesh>(null);
    const ring2Ref = useRef<THREE.Mesh>(null);

    // Smooth mouse tracking with refs to avoid re-renders
    const targetRotation = useRef({ x: 0, y: 0 });
    const currentRotation = useRef({ x: 0, y: 0 });

    const deviceQuality = useDeviceQuality();
    const quality = forcedQuality || deviceQuality;

    // Memoized colors
    const coreColors = useMemo(() => ({
        primary: colors?.primary || '#00f0ff',
        secondary: colors?.secondary || '#b44aff',
        accent: colors?.accent || '#ff2d8a'
    }), [colors?.primary, colors?.secondary, colors?.accent]);

    // Custom shader for the plasma core
    const coreMaterial = useMemo(() => {
        // Simplified noise for mobile, full simplex for desktop
        const noiseFunction = quality === 'low' ? `
      float hash(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
      }
      float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
              mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
          mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
              mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
          f.z
        );
      }
      #define snoise(v) (noise(v) * 2.0 - 1.0)
    ` : `
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      
      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
          i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }
    `;

        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor1: { value: new THREE.Color(coreColors.primary) },
                uColor2: { value: new THREE.Color(coreColors.secondary) },
                uColor3: { value: new THREE.Color(coreColors.accent) },
                uIntensity: { value: 1.5 },
                uMouse: { value: new THREE.Vector2(0, 0) },
            },
            vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        varying float vDisplacement;
        uniform float uTime;
        uniform vec2 uMouse;

        ${noiseFunction}

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vUv = uv;
          
          // Mouse interaction influence
          float mouseInfluence = length(uMouse) * 0.1;
          
          // Organic vertex displacement using noise
          float noiseScale = ${quality === 'low' ? '1.5' : '2.0'};
          float noiseSpeed = ${quality === 'low' ? '0.4' : '0.3'};
          float noise = snoise(position * noiseScale + uTime * noiseSpeed) * (0.15 + mouseInfluence);
          vec3 displaced = position + normal * noise;
          
          vDisplacement = noise;
          vPosition = (modelViewMatrix * vec4(displaced, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,
            fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform float uIntensity;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        varying float vDisplacement;

        void main() {
          // Fresnel effect — edges glow brighter
          vec3 viewDir = normalize(-vPosition);
          float fresnel = 1.0 - max(dot(viewDir, vNormal), 0.0);
          fresnel = pow(fresnel, 3.0);

          // Animated color cycling with displacement influence
          float t = sin(uTime * 0.5 + vDisplacement * 2.0) * 0.5 + 0.5;
          vec3 color = mix(uColor1, uColor2, t);
          color = mix(color, uColor3, sin(uTime * 0.3 + vUv.y * 3.14) * 0.5 + 0.5);

          // Core glow with fresnel
          float glow = fresnel * uIntensity + 0.2;
          
          // Pulsating effect
          glow *= 0.8 + 0.2 * sin(uTime * 2.0 + vDisplacement);
          
          // Rim lighting enhancement
          float rim = pow(fresnel, 2.0) * 0.5;

          gl_FragColor = vec4(color * glow + color * rim, 0.85);
        }
      `,
            transparent: true,
            side: THREE.FrontSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
    }, [quality, coreColors]);

    // Update mouse uniform
    useEffect(() => {
        if (coreMaterial.uniforms.uMouse) {
            coreMaterial.uniforms.uMouse.value.set(mouseX, mouseY);
        }
    }, [mouseX, mouseY, coreMaterial]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            coreMaterial.dispose();
        };
    }, [coreMaterial]);

    // Optimized animation loop
    useFrame((state, delta) => {
        const time = state.clock.elapsedTime;

        // Update shader time
        coreMaterial.uniforms.uTime.value = time;

        // Update target rotation from mouse
        targetRotation.current.y = mouseX * 0.3;
        targetRotation.current.x = mouseY * 0.2;

        if (groupRef.current) {
            // Smooth interpolation using lerp factor
            const lerpFactor = 1 - Math.pow(0.001, delta);

            currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * lerpFactor * 3;
            currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * lerpFactor * 3;

            groupRef.current.rotation.y = currentRotation.current.y;
            groupRef.current.rotation.x = currentRotation.current.x;

            // Auto-rotate when mouse is idle
            if (autoRotate && Math.abs(mouseX) < 0.01 && Math.abs(mouseY) < 0.01) {
                groupRef.current.rotation.y += delta * 0.1;
            }

            // Gentle floating animation
            const floatIntensity = quality === 'low' ? 0.15 : 0.2;
            groupRef.current.position.y = Math.sin(time * 0.5) * floatIntensity;
        }

        // Pulse scale on core
        if (coreRef.current) {
            const pulse = 1 + Math.sin(time * 2) * 0.015;
            coreRef.current.scale.setScalar(pulse);
        }

        // Rotate wireframe containment field
        if (wireRef.current) {
            wireRef.current.rotation.y = time * 0.2;
            wireRef.current.rotation.z = time * 0.1;
        }

        // Orbiting rings
        if (ring1Ref.current) {
            ring1Ref.current.rotation.x = time * 0.4;
            ring1Ref.current.rotation.z = time * 0.2;
        }
        if (ring2Ref.current) {
            ring2Ref.current.rotation.y = time * 0.3;
            ring2Ref.current.rotation.x = time * 0.15 + Math.PI / 3;
        }
    });

    // Adaptive geometry detail
    const coreDetail = quality === 'low' ? 8 : 12;
    const wireDetail = quality === 'low' ? 1 : 2;
    const ringSegments = quality === 'low' ? 48 : 100;
    const ringRadialSegments = quality === 'low' ? 8 : 16;

    return (
        <group ref={groupRef}>
            {/* Inner plasma core */}
            <mesh ref={coreRef} material={coreMaterial} frustumCulled={false}>
                <icosahedronGeometry args={[1.2, coreDetail]} />
            </mesh>

            {/* Outer wireframe containment */}
            <mesh ref={wireRef}>
                <icosahedronGeometry args={[1.8, wireDetail]} />
                <meshBasicMaterial
                    color={coreColors.primary}
                    wireframe
                    transparent
                    opacity={quality === 'low' ? 0.08 : 0.12}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Orbiting ring 1 */}
            <mesh ref={ring1Ref}>
                <torusGeometry args={[2.5, 0.015, ringRadialSegments, ringSegments]} />
                <meshBasicMaterial
                    color={coreColors.primary}
                    transparent
                    opacity={0.4}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Orbiting ring 2 */}
            <mesh ref={ring2Ref}>
                <torusGeometry args={[2.8, 0.01, ringRadialSegments, ringSegments]} />
                <meshBasicMaterial
                    color={coreColors.secondary}
                    transparent
                    opacity={0.3}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Inner glow point lights - reduced on mobile */}
            <pointLight
                color={coreColors.primary}
                intensity={quality === 'low' ? 2 : 4}
                distance={10}
                decay={2}
            />
            <pointLight
                color={coreColors.secondary}
                intensity={quality === 'low' ? 1 : 2}
                distance={8}
                position={[1, 1, 1]}
                decay={2}
            />
            {quality === 'high' && (
                <pointLight
                    color={coreColors.accent}
                    intensity={1}
                    distance={6}
                    position={[-1, -1, 0]}
                    decay={2}
                />
            )}
        </group>
    );
}