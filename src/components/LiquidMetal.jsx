import { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { fabricVertexShader, fabricFragmentShader } from '../shaders/liquidFabric';

const LiquidMetal = forwardRef(({ visible = true }, ref) => {
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
            rotation={[-Math.PI / 2.5, 0, 0]} // Tilted 72 degrees (facing camera more)
            position={[0, -1, -5]} // Almost center screen
            visible={visible}
        >
            {/* Wider plane for stream effect */}
            <planeGeometry args={[60, 40, 256, 128]} />
            <shaderMaterial
                vertexShader={fabricVertexShader}
                fragmentShader={fabricFragmentShader}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
});

export default LiquidMetal;
