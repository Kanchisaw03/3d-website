import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

export const CardMaterial = shaderMaterial(
    {
        uTime: 0,
        uHover: 0,
        uMouse: new THREE.Vector2(0.5, 0.5),
        uResolution: new THREE.Vector2(1, 1),
        uColor: new THREE.Color('#ffffff')
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform float uTime;
    uniform float uHover;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    
    varying vec2 vUv;

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // Base slow drift
      float noise = snoise(vUv * 2.0 + uTime * 0.1);
      
      // Ripple effect from mouse
      float dist = distance(vUv, uMouse);
      float ripple = sin(dist * 20.0 - uTime * 5.0) * exp(-dist * 3.0) * uHover;
      
      // Glassy look
      vec3 color = vec3(0.05); // Dark base
      
      // Edge glow
      float edge = 1.0 - max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)) * 2.0;
      edge = smoothstep(0.0, 0.1, edge);
      
      // Combine
      color += vec3(0.1, 0.2, 0.3) * noise; // Blueish noise
      color += vec3(0.0, 0.8, 1.0) * ripple; // Cyan ripple
      color += vec3(0.2) * (1.0 - edge) * uHover; // Hover edge glow
      
      gl_FragColor = vec4(color, 0.2 + uHover * 0.1);
    }
  `
);

extend({ CardMaterial });
