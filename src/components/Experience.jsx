import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import ChromeStream from './ChromeStream';
import LiquidSphere from './LiquidSphere';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';

// Native Scroll Rig: Maps window.scrollY to camera movement
function NativeScrollRig() {
    useFrame((state) => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollTop = window.scrollY;
        const safeDocHeight = docHeight > 0 ? docHeight : 1;
        const progress = Math.max(0, Math.min(1, scrollTop / safeDocHeight));

        // PHASE 1: Zoom in (0 to 0.3)
        const zPos = THREE.MathUtils.lerp(15, 5, progress);
        state.camera.position.z = zPos;

        // PHASE 2: Rotate around
        state.camera.rotation.z = progress * 0.5;

        // PHASE 3: Focus shift
        state.camera.position.y = THREE.MathUtils.lerp(0, 2, progress * progress);
        state.camera.lookAt(0, 0, 0);
    });
    return null;
}

// Improved Rig that handles opacity directly via refs
function ScrollOrchestrator({ liquidRef, chromeRef }) {
    useFrame(() => {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;

        // Transition Zone: Start fading at 20% scroll (leaving hero), gone by 100% (About start)
        const startFade = viewportHeight * 0.2;
        const endFade = viewportHeight * 1.0;

        let liquidOpacity = 1.0;
        let chromeOpacity = 0.0;

        if (scrollY < startFade) {
            liquidOpacity = 1.0;
            chromeOpacity = 0.0;
        } else if (scrollY >= startFade && scrollY < endFade) {
            const t = (scrollY - startFade) / (endFade - startFade);
            liquidOpacity = 1.0 - t;
            chromeOpacity = t;
        } else {
            liquidOpacity = 0.0;
            chromeOpacity = 1.0;
        }

        // Apply to Liquid Sphere
        if (liquidRef.current) {
            liquidRef.current.material.uniforms.uOpacity.value = liquidOpacity;
            liquidRef.current.visible = liquidOpacity > 0.01;
        }

        // Apply to Chrome Stream
        if (chromeRef.current) {
            // Because we used onBeforeCompile, we must update the injected uniform
            // AND the main opacity for transparency sorting/culling
            if (chromeRef.current.material.uniforms && chromeRef.current.material.uniforms.uOpacity) {
                chromeRef.current.material.uniforms.uOpacity.value = chromeOpacity;
            }
            // Also map to standard opacity for good measure if shader uses it
            chromeRef.current.material.opacity = chromeOpacity;

            chromeRef.current.visible = chromeOpacity > 0.01;
        }
    });
    return null;
}

export default function Experience() {
    const liquidRef = useRef();
    const chromeRef = useRef();

    return (
        <Canvas
            camera={{ position: [0, 0, 15], fov: 35 }}
            dpr={[1.5, 2]} // Minimum 1.5x resolution to prevent pixelation
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            className="!fixed top-0 left-0 w-full h-full z-0"
        >
            <color attach="background" args={['#050505']} />
            <fog attach="fog" args={['#050505', 10, 30]} />

            <ambientLight intensity={0.2} />
            <spotLight
                position={[10, 15, 10]}
                angle={0.3}
                penumbra={1}
                intensity={2}
                castShadow
            />

            <NativeScrollRig />
            <ScrollOrchestrator liquidRef={liquidRef} chromeRef={chromeRef} />

            <Suspense fallback={null}>
                {/* Pass ref to LiquidSphere to allow Orchestrator to control it */}
                <LiquidSphere ref={liquidRef} />
                <ChromeStream ref={chromeRef} visible={true} />
            </Suspense>

            {/* Stronger reflections for Chrome */}
            <Environment preset="warehouse" />
        </Canvas>
    );
}
