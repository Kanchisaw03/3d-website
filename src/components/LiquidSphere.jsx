import { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { liquidVertexShader, liquidFragmentShader } from '../shaders/liquidMetal';
import { easing } from 'maath';

const LiquidSphere = forwardRef((props, ref) => {
    const internalRef = useRef();

    // Expose internal mesh to parent ref
    useImperativeHandle(ref, () => internalRef.current);

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
            uOpacity: { value: 1.0 }, // Initialize full opacity
        }),
        [glassMap]
    );

    useFrame((state, delta) => {
        if (internalRef.current) {
            // Update Time
            internalRef.current.material.uniforms.uTime.value += delta * 0.5;

            // Organic Rotation
            internalRef.current.rotation.y += delta * 0.05;
            internalRef.current.rotation.z += delta * 0.02;

            // Damp Interaction
            easing.damp(internalRef.current.material.uniforms.uInteract, 'value', targetInteract.current, 0.25, delta);
            easing.damp3(internalRef.current.material.uniforms.uPoint.value, targetPoint.current, 0.25, delta);
        }
    });

    const handlePointerMove = (e) => {
        if (internalRef.current) {
            const localPoint = e.point.clone();
            internalRef.current.worldToLocal(localPoint);
            targetPoint.current.copy(localPoint);
            targetInteract.current = 1.0;
        }
    };

    const handlePointerOut = () => {
        targetInteract.current = 0.0;
    };

    return (
        <mesh
            ref={internalRef}
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
                transparent={true} // Enable transparency
                depthWrite={false} // Prevent z-fighting during fade
            />
        </mesh>
    );
});

export default LiquidSphere;
