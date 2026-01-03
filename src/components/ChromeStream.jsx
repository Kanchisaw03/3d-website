import { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';

const ChromeStream = forwardRef(({ visible = true }, ref) => {
    const meshRef = useRef();
    useImperativeHandle(ref, () => meshRef.current);

    // Uniforms for the displacement
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uOpacity: { value: 1.0 },
        }),
        []
    );

    // Modify the standard material to include vertex displacement
    const onBeforeCompile = (shader) => {
        shader.uniforms.uTime = uniforms.uTime;
        shader.uniforms.uOpacity = uniforms.uOpacity;

        // Add varying to pass position/uv if needed or just use built-ins
        // We inject our displacement logic into the vertex shader
        shader.vertexShader = `
            uniform float uTime;
            
            // Rotation matrix for twisting
            mat2 rotate2D(float angle) {
                return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
            }

            vec3 calculateTwist(vec3 pos) {
                float t = uTime * 0.3;
                
                // Add flow movement
                float flowX = pos.x + t * 2.0;
                
                // Calculate twist amount based on X position and time
                float twistAngle = cos(flowX * 0.2) * 2.5; // Large, slow twists
                
                // Apply twist to Y/Z plane (around the flow axis X)
                vec2 yz = pos.yz;
                yz = rotate2D(twistAngle) * yz;
                
                // Add some chaotic turbulence/swirls
                float swell = sin(flowX * 0.5) * 1.5;
                yz += vec2(sin(flowX * 1.5), cos(flowX * 1.2)) * 0.5;
                
                // Expand thickness in the middle of swirls
                yz *= (1.0 + swell * 0.5);
                
                return vec3(pos.x, yz.x, yz.y);
            }
        ` + shader.vertexShader;

        // Inject displacement into the main function
        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
            #include <begin_vertex>
            
            // Apply Swirl/Twist
            vec3 twisted = calculateTwist(transformed);
            transformed = twisted;

            // Recalculate Normals (Finite Difference)
            float epsilon = 0.05;
            vec3 pA = calculateTwist(position + vec3(epsilon, 0.0, 0.0));
            vec3 pB = calculateTwist(position + vec3(0.0, 0.0, epsilon)); // Use Z for width
            
            vec3 tanX = normalize(pA - twisted);
            vec3 tanZ = normalize(pB - twisted);
            
            vNormal = normalize(cross(tanZ, tanX));
            `
        );

        // Handle Opacity in Fragment
        shader.fragmentShader = `
            uniform float uOpacity;
        ` + shader.fragmentShader;

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            `
            #include <dithering_fragment>
            gl_FragColor.a *= uOpacity; // Apply manual opacity control
            `
        );
    };

    useFrame((state, delta) => {
        uniforms.uTime.value += delta;
    });

    return (
        <mesh
            ref={meshRef}
            // Diagonal flow across the screen
            rotation={[0, -Math.PI / 6, Math.PI / 8]}
            position={[0, 0, -5]}
            visible={visible}
        >
            {/* Long Ribbbon: Width (X) 40, Height (Y) 4 => Narrow strip */}
            <planeGeometry args={[40, 4, 300, 100]} />

            {/* PBR Material for Photorealism */}
            <meshPhysicalMaterial
                color="#eef2f5"
                emissive="#111111"
                metalness={1.0}
                roughness={0.05} // Very shiny
                clearcoat={1.0}
                clearcoatRoughness={0.0}
                transparent={true}
                opacity={1.0}
                side={THREE.DoubleSide}
                onBeforeCompile={onBeforeCompile}
                envMapIntensity={2.5}
            />
        </mesh>
    );
});

export default ChromeStream;
