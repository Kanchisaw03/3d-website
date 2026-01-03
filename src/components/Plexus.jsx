import { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Plexus = forwardRef(({ visible = true }, ref) => {
    const groupRef = useRef();
    useImperativeHandle(ref, () => groupRef.current);

    // Dynamic Geometry for Lines
    const lineGeo = useMemo(() => new THREE.BufferGeometry(), []);
    const particles = useMemo(() => {
        const count = 60; // Fewer particles for cleaner look
        const positions = new Float32Array(count * 3);
        const velocities = [];

        for (let i = 0; i < count; i++) {
            // Spread across screen
            positions[i * 3] = (Math.random() - 0.5) * 30; // X
            positions[i * 3 + 1] = (Math.random() - 0.5) * 30; // Y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z

            velocities.push({
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            });
        }
        return { positions, velocities, count };
    }, []);

    useFrame(() => {
        if (!groupRef.current) return;

        // Update Particles
        const positions = particles.positions;
        for (let i = 0; i < particles.count; i++) {
            positions[i * 3] += particles.velocities[i].x;
            positions[i * 3 + 1] += particles.velocities[i].y;
            positions[i * 3 + 2] += particles.velocities[i].z;

            // Bounce bounds
            if (Math.abs(positions[i * 3]) > 15) particles.velocities[i].x *= -1;
            if (Math.abs(positions[i * 3 + 1]) > 15) particles.velocities[i].y *= -1;
        }

        // Build Lines
        const linePositions = [];
        const connectionDistance = 6;

        for (let i = 0; i < particles.count; i++) {
            for (let j = i + 1; j < particles.count; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < connectionDistance) {
                    linePositions.push(
                        positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                        positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
                    );
                }
            }
        }

        lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

        // Rotate Group
        groupRef.current.rotation.y += 0.001;
    });

    return (
        <group ref={groupRef}>
            {/* Dots */}
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particles.count}
                        array={particles.positions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.15}
                    color="#00f2ff" // Electric Cyan
                    transparent
                    opacity={0} // Controlled by orchestrator
                />
            </points>

            {/* Connecting Lines */}
            <lineSegments geometry={lineGeo}>
                <lineBasicMaterial
                    color="#00f2ff"
                    transparent
                    opacity={0} // Controlled by orchestrator
                    linewidth={1}
                />
            </lineSegments>
        </group>
    );
});

export default Plexus;
