import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useViewStore } from '../stores/viewStore';
import * as THREE from 'three';

function SyncedCard({ domRef }) {
    const meshRef = useRef();
    const { viewport, size } = useThree();

    // Animation state
    const targetZ = useRef(-0.6);
    const targetOpacity = useRef(0);

    useFrame((state, delta) => {
        if (!domRef?.current || !meshRef.current) return;

        const rect = domRef.current.getBoundingClientRect();

        // Calculate Scroll Progress
        // Normalized Y: 1 when top of element is at top of screen, 0 when at bottom?
        // Let's use center.
        const centerY = rect.top + rect.height / 2;
        const screenHeight = size.height; // Logic screen height

        // We want the card to be fully popped out (Z=0) when it's well within viewport.
        // Start popping out when it enters bottom.
        // Progress: 0 (just entering bottom) -> 1 (fully visible / center)
        // Range: rect.top > screenHeight (not visible)
        // rect.top < screenHeight (entering)

        // Heuristic:
        // entry point: rect.top = screenHeight
        // full point: rect.top = screenHeight * 0.7 (30% up)

        const entryThreshold = window.innerHeight;
        const fullThreshold = window.innerHeight * 0.7; // 30% from bottom

        let progress = 0;
        if (rect.top > entryThreshold) progress = 0;
        else if (rect.top < fullThreshold) progress = 1;
        else {
            progress = 1 - (rect.top - fullThreshold) / (entryThreshold - fullThreshold);
        }

        // Target values
        const z = THREE.MathUtils.lerp(-0.6, 0, progress);
        const opacity = THREE.MathUtils.lerp(0, 1, progress);

        // Position Mapping
        const x = (rect.left + rect.width / 2 - size.width / 2) / size.width * viewport.width;
        // Adjust Y slightly for parallax if requested, otherwise strict sync
        // User asked for "Slight Y-axis offset correction"
        const parallaxY = (progress - 1) * 0.5; // Slight shift from bottom

        const y = -(rect.top + rect.height / 2 - size.height / 2) / size.height * viewport.height;

        // Dampening (Heavy feel)
        // Lerp current mesh position to target
        meshRef.current.position.x = x;
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, y, delta * 10); // Sync Y fast
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, z, delta * 2); // Damp Z slow

        meshRef.current.scale.set(
            (rect.width / size.width) * viewport.width,
            (rect.height / size.height) * viewport.height,
            1
        );

        // Update opacity
        if (meshRef.current.material) {
            meshRef.current.material.opacity = THREE.MathUtils.lerp(meshRef.current.material.opacity, opacity, delta * 3);
        }
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[1, 1]} />
            <meshPhysicalMaterial
                color="#101010"
                roughness={0.3}
                metalness={0.8}
                transparent
                opacity={0}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

export default function WebGLManager() {
    const elements = useViewStore((state) => state.elements);
    const renderItems = useMemo(() => Object.entries(elements), [elements]);

    return (
        <group>
            {renderItems.map(([id, { ref, type }]) => {
                if (type === 'card') {
                    return <SyncedCard key={id} domRef={ref} />;
                }
                return null;
            })}
        </group>
    );
}
