import { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ChromeStream = forwardRef(({ visible = true }, ref) => {
    const meshRef = useRef();
    useImperativeHandle(ref, () => meshRef.current);

    // Uniforms
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uOpacity: { value: 1.0 },
        }),
        []
    );

    const onBeforeCompile = (shader) => {
        shader.uniforms.uTime = uniforms.uTime;

        // 1. Inject Noise Functions
        shader.vertexShader = `
            uniform float uTime;
            
            // Simplex 3D Noise 
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            float snoise(vec3 v) {
                const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
                const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
                vec3 i  = floor(v + dot(v, C.yyy) );
                vec3 x0 = v - i + dot(i, C.xxx) ;
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min( g.xyz, l.zxy );
                vec3 i2 = max( g.xyz, l.zxy );
                vec3 x1 = x0 - i1 + C.xxx;
                vec3 x2 = x0 - i2 + C.yyy;
                vec3 x3 = x0 - D.yyy;
                i = mod289(i);
                vec4 p = permute( permute( permute( 
                            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                        + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                float n_ = 0.142857142857;
                vec3  ns = n_ * D.wyz - D.xzx;
                vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_ );
                vec4 x = x_ *ns.x + ns.yyyy;
                vec4 y = y_ *ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);
                vec4 b0 = vec4( x.xy, y.xy );
                vec4 b1 = vec4( x.zw, y.zw );
                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
                vec3 p0 = vec3(a0.xy,h.x);
                vec3 p1 = vec3(a0.zw,h.y);
                vec3 p2 = vec3(a1.xy,h.z);
                vec3 p3 = vec3(a1.zw,h.w);
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                p0 *= norm.x;
                p1 *= norm.y;
                p2 *= norm.z;
                p3 *= norm.w;
                vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                            dot(p2,x2), dot(p3,x3) ) );
            }
        ` + shader.vertexShader;

        // 2. Inject Displacement Logic
        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
            #include <begin_vertex>
            
            float time = uTime * 0.2; // Elegant flow speed
            
            // Domain Warping Logic (Matched to Reference Image)
            // Stretched along Y to create "Long Lines" instead of blobs
            vec3 p = transformed;
            p.x *= 0.5; // X scale
            p.y *= 0.08; // Y scale (Very low frequency = Long waves)
            p.z *= 0.5; // Z scale
            
            // 1. Flow Direction (Warp)
            vec3 warp = vec3(0.0);
            warp.x = snoise(p + vec3(time * 0.1, 0.0, 0.0));
            warp.y = snoise(p + vec3(0.0, time * 0.2, 0.0));
            warp.z = snoise(p + vec3(0.0, 0.0, time * 0.1));
            
            // 2. Displace coordinate system
            vec3 q = p + warp * 0.4; 
            
            // 3. Flow vertically
            q.y -= time * 0.5; 
            
            // 4. Calculate Displacement
            // Use lower frequency noise for the main shape
            float displacement = snoise(q) * 1.2; 
            
            // Smooth it out (Sigmoid-like curve to make it look "tensioned")
            displacement = smoothstep(-1.0, 1.0, displacement);
            
            // Apply displacement radially
            vec3 dispDir = normalize(vec3(transformed.x, 0.0, transformed.z));
            if (length(dispDir) < 0.01) dispDir = vec3(1.0, 0.0, 0.0);

            transformed += dispDir * displacement * 2.5; // Stronger but smoother displacement
            
            // Recalculate Normals (Finite Difference)
            float e = 0.1;
            
            // Sample neighbors (Correctly scaled)
            vec3 p_x = (transformed + vec3(e, 0, 0)); p_x.x*=0.5; p_x.y*=0.08; p_x.z*=0.5;
            vec3 p_y = (transformed + vec3(0, e, 0)); p_y.x*=0.5; p_y.y*=0.08; p_y.z*=0.5;
            vec3 p_z = (transformed + vec3(0, 0, e)); p_z.x*=0.5; p_z.y*=0.08; p_z.z*=0.5;
            
            // Reuse warp logic? Simplified:
            // Just sample the base noise gradient for the "Glassy" feel. 
            // We don't need perfect accurate normals for liquid, just "bumpy" ones.
            
            // We'll sample the warped noise function approximation
            vec3 q_x = p_x + warp * 0.4; q_x.y -= time * 0.5;
            vec3 q_y = p_y + warp * 0.4; q_y.y -= time * 0.5;
            vec3 q_z = p_z + warp * 0.4; q_z.y -= time * 0.5;
            
            float d_x = snoise(q_x);
            float d_y = snoise(q_y);
            float d_z = snoise(q_z);
            
            // Gradient
            vec3 nVec = vec3(d_x - snoise(q), d_y - snoise(q), d_z - snoise(q));
            
            // Perturb normal
            // 0.8 strength creates "Highlight Lines" along the waves
            vec3 perturbed = normalize(normal - nVec * 0.8); 
            vNormal = normalize(normalMatrix * perturbed);
            `
        );
    };

    useFrame((state, delta) => {
        uniforms.uTime.value += delta;
    });

    return (
        <mesh
            ref={meshRef}
            // Rotate Z to make cylinder horizontal (Left-Right stream)
            // Tilted diagonally (Math.PI / 2.3)
            // Rotate X slightly to tilt toward camera
            rotation={[Math.PI / 12, 0, Math.PI / 2.3]}
            position={[0, 0, -8]}
            visible={visible}
            frustumCulled={false}
        >
            {/* 
               RadiusTop: 0.6, RadiusBottom: 0.6 (Narrower/Smaller)
               Height: 35
               RadialSegments: 64 
               HeightSegments: 300
            */}
            <cylinderGeometry args={[0.6, 0.6, 35, 64, 300, true]} />

            <meshPhysicalMaterial
                color="#ffffff"
                emissive="#050505"
                metalness={1.0}
                roughness={0.1}
                clearcoat={1.0}
                clearcoatRoughness={0.1}
                transparent={true}
                opacity={1.0}
                side={THREE.DoubleSide}
                onBeforeCompile={onBeforeCompile}
                envMapIntensity={3.0}
            />
        </mesh>
    );
});

export default ChromeStream;
