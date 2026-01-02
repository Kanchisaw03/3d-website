import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import LiquidSphere from './LiquidSphere';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

// Native Scroll Rig: Maps window.scrollY to camera movement
function NativeScrollRig() {
    useFrame((state) => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollTop = window.scrollY;
        // Protect against divide by zero or negative heights
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

export default function Experience() {
    return (
        <Canvas
            camera={{ position: [0, 0, 15], fov: 35 }}
            dpr={[1, 2]} // Support high-DPI screens
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

            <Suspense fallback={null}>
                <LiquidSphere />
            </Suspense>

            <Environment preset="city" />
        </Canvas>
    );
}
