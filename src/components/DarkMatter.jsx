import { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DarkMatter = forwardRef(({ visible = true }, ref) => {
    const pointsRef = useRef();

    useImperativeHandle(ref, () => pointsRef.current);

    // Generate sparse particles
    const particles = useMemo(() => {
        const count = 300; // Sparse "billion dollar" look
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            // Spread widely
            const r = 15 + Math.random() * 20;
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            sizes[i] = Math.random() * 0.15; // Small, elegant points
        }
        return { positions, sizes };
    }, []);

    useFrame((state, delta) => {
        if (pointsRef.current) {
            // Slow, majestic rotation
            pointsRef.current.rotation.y += delta * 0.02;
            pointsRef.current.rotation.x += delta * 0.01;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.positions.length / 3}
                    array={particles.positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={particles.sizes.length}
                    array={particles.sizes}
                    itemSize={1}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                color="#88ccff"
                transparent
                opacity={0} // Start invisible, controlled by orchestrator
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
});

export default DarkMatter;
