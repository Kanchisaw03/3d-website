import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { liquidVertexShader, liquidFragmentShader } from '../shaders/liquidMetal';
import { easing } from 'maath';

export default function LiquidSphere() {
    const meshRef = useRef();

    // Interactive targets
    const targetPoint = useRef(new THREE.Vector3());
    const targetInteract = useRef(0);

    // Load texture
    const [glassMap] = useLoader(TextureLoader, ['/assets/textures/liquid_glass.png']);
    useMemo(() => {
        glassMap.wrapS = glassMap.wrapT = THREE.RepeatWrapping;
        // Max anisotropy for sharp rendering at angles
        glassMap.anisotropy = 16;
        glassMap.minFilter = THREE.LinearMipmapLinearFilter;
        glassMap.magFilter = THREE.LinearFilter;
    }, [glassMap]);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uDistort: { value: 0.4 },
            uTexture: { value: glassMap },
            uPoint: { value: new THREE.Vector3() },
            uInteract: { value: 0.0 },
        }),
        [glassMap]
    );

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Update Time
            meshRef.current.material.uniforms.uTime.value += delta * 0.5;

            // Organic Rotation
            meshRef.current.rotation.y += delta * 0.05;
            meshRef.current.rotation.z += delta * 0.02;

            // Damp Interaction
            easing.damp(meshRef.current.material.uniforms.uInteract, 'value', targetInteract.current, 0.25, delta);
            easing.damp3(meshRef.current.material.uniforms.uPoint.value, targetPoint.current, 0.25, delta);
        }
    });

    const handlePointerMove = (e) => {
        // e.point is in world space. Convert to local space for interaction.
        if (meshRef.current) {
            const localPoint = e.point.clone();
            meshRef.current.worldToLocal(localPoint);
            targetPoint.current.copy(localPoint);
            targetInteract.current = 1.0;
        }
    };

    const handlePointerOut = () => {
        targetInteract.current = 0.0;
    };

    return (
        <mesh
            ref={meshRef}
            position={[0, 0, 0]}
            onPointerMove={handlePointerMove}
            onPointerOut={handlePointerOut}
        >
            <sphereGeometry args={[2, 128, 128]} />
            <shaderMaterial
                vertexShader={liquidVertexShader}
                fragmentShader={liquidFragmentShader}
                uniforms={uniforms}
                wireframe={false}
            />
        </mesh>
    );
}
