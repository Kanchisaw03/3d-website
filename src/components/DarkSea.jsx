import { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seaVertexShader, seaFragmentShader } from '../shaders/darkSea';

const DarkSea = forwardRef(({ visible = true }, ref) => {
    const meshRef = useRef();
    useImperativeHandle(ref, () => meshRef.current);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uOpacity: { value: 0.0 }, // Start invisible
        }),
        []
    );

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value += delta;
        }
    });

    return (
        <mesh
            ref={meshRef}
            rotation={[-Math.PI / 2.5, 0, 0]} // Tilted plane (Almost floor, slight angle back)
            position={[0, -5, -10]} // Below and back
            visible={visible}
        >
            {/* Large plane, many segments for smooth waves */}
            <planeGeometry args={[60, 60, 128, 128]} />
            <shaderMaterial
                vertexShader={seaVertexShader}
                fragmentShader={seaFragmentShader}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false} // Disable depth write to help blending? Or keep true for solid liquid?
                // Let's keep depthWrite false for smoother fade, but might mess up z-sorting. 
                // Since it's background, false is usually safe.
                side={THREE.DoubleSide}
            />
        </mesh>
    );
});

export default DarkSea;
