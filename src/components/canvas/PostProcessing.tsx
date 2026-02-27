'use client';

import { useMemo, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import {
    EffectComposer,
    Bloom,
    ChromaticAberration,
    Vignette,
    Noise,
    SMAA,
    ToneMapping,
    BrightnessContrast,
    HueSaturation
} from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode, SMAAPreset } from 'postprocessing';
import { Vector2 } from 'three';

/**
 * PostProcessing
 * Adds cinematic post-processing effects to the 3D scene.
 * 
 * Effects pipeline:
 * - SMAA: Anti-aliasing for smooth edges
 * - Bloom: Makes bright areas glow (neon effect)
 * - Chromatic Aberration: RGB split for sci-fi feel
 * - Vignette: Darkened edges for focus
 * - Noise: Film grain for cinematic quality
 * - Tone Mapping: HDR to SDR conversion
 * - Color Grading: Brightness, contrast, saturation
 * 
 * Optimizations:
 * - Device-adaptive quality settings
 * - Conditional effect rendering
 * - Performance-conscious defaults
 */

interface PostProcessingProps {
    /** Quality preset */
    quality?: 'low' | 'medium' | 'high' | 'ultra';
    /** Enable/disable bloom effect */
    enableBloom?: boolean;
    /** Enable/disable chromatic aberration */
    enableAberration?: boolean;
    /** Enable/disable vignette */
    enableVignette?: boolean;
    /** Enable/disable film grain */
    enableNoise?: boolean;
    /** Enable/disable anti-aliasing */
    enableAA?: boolean;
    /** Enable/disable color grading */
    enableColorGrading?: boolean;
    /** Bloom intensity override */
    bloomIntensity?: number;
    /** Chromatic aberration strength */
    aberrationStrength?: number;
    /** Vignette darkness */
    vignetteDarkness?: number;
    /** Film grain opacity */
    noiseOpacity?: number;
    /** Overall effect intensity (0-1) */
    intensity?: number;
    /** Animated effects */
    animated?: boolean;
    /** Mouse position for dynamic effects */
    mouseX?: number;
    mouseY?: number;
}

type QualityLevel = 'low' | 'medium' | 'high' | 'ultra';

interface QualityPreset {
    multisampling: number;
    bloomMipmapBlur: boolean;
    bloomKernelSize: number;
    smaaPreset: SMAAPreset;
    enableNoise: boolean;
    enableAberration: boolean;
    bloomIntensity: number;
    bloomLuminanceThreshold: number;
    bloomLuminanceSmoothing: number;
    bloomLevels: number;
}

// Device capability detection
const useDeviceQuality = (): QualityLevel => {
    const { gl } = useThree();

    return useMemo(() => {
        if (typeof window === 'undefined') return 'medium';

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
        const pixelRatio = gl.getPixelRatio();

        try {
            const renderer = gl.getContext();
            const debugInfo = renderer.getExtension('WEBGL_debug_renderer_info');

            if (debugInfo) {
                const gpuRenderer = renderer.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                const isHighEndGPU = /RTX|GTX|Radeon RX|Apple M[1-3]/i.test(gpuRenderer);

                if (isHighEndGPU && pixelRatio >= 2) return 'ultra';
            }
        } catch {
            // Fallback if WebGL context access fails
        }

        if (isMobile) return 'low';
        if (pixelRatio < 1.5) return 'low';
        if (pixelRatio >= 2) return 'high';
        return 'medium';
    }, [gl]);
};

// Quality presets configuration
const qualityPresets: Record<QualityLevel, QualityPreset> = {
    low: {
        multisampling: 0,
        bloomMipmapBlur: false,
        bloomKernelSize: 2,
        smaaPreset: SMAAPreset.LOW,
        enableNoise: false,
        enableAberration: false,
        bloomIntensity: 1.0,
        bloomLuminanceThreshold: 0.4,
        bloomLuminanceSmoothing: 0.7,
        bloomLevels: 5,
    },
    medium: {
        multisampling: 0,
        bloomMipmapBlur: true,
        bloomKernelSize: 3,
        smaaPreset: SMAAPreset.MEDIUM,
        enableNoise: false,
        enableAberration: true,
        bloomIntensity: 1.2,
        bloomLuminanceThreshold: 0.3,
        bloomLuminanceSmoothing: 0.8,
        bloomLevels: 5,
    },
    high: {
        multisampling: 0,
        bloomMipmapBlur: true,
        bloomKernelSize: 4,
        smaaPreset: SMAAPreset.HIGH,
        enableNoise: true,
        enableAberration: true,
        bloomIntensity: 1.5,
        bloomLuminanceThreshold: 0.2,
        bloomLuminanceSmoothing: 0.9,
        bloomLevels: 7,
    },
    ultra: {
        multisampling: 4,
        bloomMipmapBlur: true,
        bloomKernelSize: 5,
        smaaPreset: SMAAPreset.ULTRA,
        enableNoise: true,
        enableAberration: true,
        bloomIntensity: 1.8,
        bloomLuminanceThreshold: 0.15,
        bloomLuminanceSmoothing: 0.95,
        bloomLevels: 9,
    },
};

// Main component with all effects
function FullPostProcessing({
    preset,
    enableAA,
    enableBloom,
    enableAberration,
    enableVignette,
    enableNoise,
    enableColorGrading,
    computedBloomIntensity,
    computedVignetteDarkness,
    computedNoiseOpacity,
    aberrationOffset,
    intensity,
}: {
    preset: QualityPreset;
    enableAA: boolean;
    enableBloom: boolean;
    enableAberration: boolean;
    enableVignette: boolean;
    enableNoise: boolean;
    enableColorGrading: boolean;
    computedBloomIntensity: number;
    computedVignetteDarkness: number;
    computedNoiseOpacity: number;
    aberrationOffset: Vector2;
    intensity: number;
}) {
    return (
        <EffectComposer multisampling={preset.multisampling}>
            <SMAA preset={enableAA ? preset.smaaPreset : SMAAPreset.LOW} />

            <Bloom
                intensity={enableBloom ? computedBloomIntensity : 0}
                luminanceThreshold={preset.bloomLuminanceThreshold}
                luminanceSmoothing={preset.bloomLuminanceSmoothing}
                mipmapBlur={preset.bloomMipmapBlur}
                levels={preset.bloomLevels}
            />

            <ChromaticAberration
                blendFunction={BlendFunction.NORMAL}
                offset={enableAberration && preset.enableAberration ? aberrationOffset : new Vector2(0, 0)}
                radialModulation
                modulationOffset={0.2}
            />

            <ToneMapping
                mode={ToneMappingMode.ACES_FILMIC}
                resolution={256}
                whitePoint={4.0}
                middleGrey={0.6}
                minLuminance={0.01}
                averageLuminance={1.0}
                adaptationRate={1.0}
            />

            <BrightnessContrast
                brightness={enableColorGrading ? 0.02 * intensity : 0}
                contrast={enableColorGrading ? 0.1 * intensity : 0}
            />

            <HueSaturation
                hue={0}
                saturation={enableColorGrading ? 0.15 * intensity : 0}
            />

            <Vignette
                offset={0.3}
                darkness={enableVignette ? computedVignetteDarkness : 0}
                blendFunction={BlendFunction.NORMAL}
            />

            <Noise
                premultiply
                blendFunction={BlendFunction.SOFT_LIGHT}
                opacity={enableNoise && preset.enableNoise ? computedNoiseOpacity : 0}
            />
        </EffectComposer>
    );
}

// Minimal effects for low-end devices
function MinimalPostProcessing({
    bloomIntensity,
    vignetteDarkness,
}: {
    bloomIntensity: number;
    vignetteDarkness: number;
}) {
    return (
        <EffectComposer multisampling={0}>
            <Bloom
                intensity={bloomIntensity}
                luminanceThreshold={0.4}
                luminanceSmoothing={0.7}
                mipmapBlur={false}
            />
            <Vignette
                offset={0.3}
                darkness={vignetteDarkness}
                blendFunction={BlendFunction.NORMAL}
            />
        </EffectComposer>
    );
}

export default function PostProcessing({
    quality: forcedQuality,
    enableBloom = true,
    enableAberration = true,
    enableVignette = true,
    enableNoise,
    enableAA = true,
    enableColorGrading = false,
    bloomIntensity,
    aberrationStrength,
    vignetteDarkness,
    noiseOpacity,
    intensity = 1,
    animated = false,
    mouseX = 0,
    mouseY = 0,
}: PostProcessingProps) {
    const deviceQuality = useDeviceQuality();
    const quality = forcedQuality ?? deviceQuality;
    const preset = qualityPresets[quality];

    // Refs for animated effects
    const timeRef = useRef(0);

    // Dynamic chromatic aberration offset based on mouse
    const aberrationOffset = useMemo(() => {
        const baseStrength = aberrationStrength ?? 0.0006;
        const mouseInfluence = animated ? Math.sqrt(mouseX ** 2 + mouseY ** 2) * 0.0003 : 0;
        const strength = (baseStrength + mouseInfluence) * intensity;
        return new Vector2(strength, strength);
    }, [aberrationStrength, mouseX, mouseY, animated, intensity]);

    // Animated effects update
    useFrame((state) => {
        if (!animated) return;
        timeRef.current = state.clock.elapsedTime;
    });

    // Computed values with intensity scaling
    const baseBloomIntensity = bloomIntensity ?? preset.bloomIntensity;
    const animatedBloomPulse = animated ? Math.sin(timeRef.current * 0.5) * 0.1 : 0;
    const computedBloomIntensity = (baseBloomIntensity + animatedBloomPulse) * intensity;
    const computedVignetteDarkness = (vignetteDarkness ?? 0.7) * intensity;
    const computedNoiseOpacity = (noiseOpacity ?? 0.15) * intensity;

    // Determine which optional effects to enable
    const shouldEnableNoise = enableNoise ?? preset.enableNoise;

    // Use minimal version for low quality
    if (quality === 'low' && !forcedQuality) {
        return (
            <MinimalPostProcessing
                bloomIntensity={computedBloomIntensity}
                vignetteDarkness={computedVignetteDarkness}
            />
        );
    }

    return (
        <FullPostProcessing
            preset={preset}
            enableAA={enableAA}
            enableBloom={enableBloom}
            enableAberration={enableAberration}
            enableVignette={enableVignette}
            enableNoise={shouldEnableNoise}
            enableColorGrading={enableColorGrading}
            computedBloomIntensity={computedBloomIntensity}
            computedVignetteDarkness={computedVignetteDarkness}
            computedNoiseOpacity={computedNoiseOpacity}
            aberrationOffset={aberrationOffset}
            intensity={intensity}
        />
    );
}

// Lightweight export for manual use
export function PostProcessingLite({
    bloomIntensity = 1.0,
    enableVignette = true,
}: {
    bloomIntensity?: number;
    enableVignette?: boolean;
}) {
    return (
        <EffectComposer multisampling={0}>
            <Bloom
                intensity={bloomIntensity}
                luminanceThreshold={0.4}
                luminanceSmoothing={0.7}
                mipmapBlur={false}
            />
            <Vignette
                offset={0.3}
                darkness={enableVignette ? 0.5 : 0}
                blendFunction={BlendFunction.NORMAL}
            />
        </EffectComposer>
    );
}

export { PostProcessing };