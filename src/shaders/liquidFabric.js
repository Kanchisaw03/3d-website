// Vertex Shader: Directional Chrome Stream
export const fabricVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;

  uniform float uTime;

  void main() {
    vUv = uv;
    vNormal = normal;

    vec3 pos = position;
    
    // DIRECTIONAL FLOW (Left to Right stream)
    float time = uTime * 0.3; // Faster, fluid flow
    
    // Main large ribbon waves
    float flow = sin(pos.x * 0.4 + time) * 2.0; 
    
    // Secondary ripples (perpendicular to flow)
    float ripples = cos(pos.x * 1.0 + pos.y * 0.5 + time * 1.5) * 0.5;
    
    // Vertical displacement based on flow
    pos.z += flow + ripples;
    
    // Twist/pinch effect to make it look like a stream/ribbon
    // (Optional: Attenuate Z at edges if we had UVs mapped that way, but plane is large)
    
    vPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Fragment Shader: High-Gloss Liquid Chrome
export const fabricFragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  uniform float uOpacity;
  uniform float uTime;

  void main() {
    // Reconstruct normals for the displaced surface
    vec3 xTangent = dFdx(vPosition);
    vec3 yTangent = dFdy(vPosition);
    vec3 faceNormal = normalize(cross(xTangent, yTangent));
    
    vec3 viewDir = normalize(cameraPosition - vPosition);
    
    // CHROME LIGHTING (High Contrast)
    float NdotV = dot(faceNormal, viewDir);
    float fresnel = pow(1.0 - abs(NdotV), 3.0); 
    
    // Multiple lights for studio metallic look
    vec3 light1Dir = normalize(vec3(1.0, 1.0, 1.0));
    vec3 light2Dir = normalize(vec3(-1.0, 0.5, 0.5));
    
    // Specular Highlight (Sharp)
    float spec1 = pow(max(dot(reflect(-light1Dir, faceNormal), -viewDir), 0.0), 32.0);
    float spec2 = pow(max(dot(reflect(-light2Dir, faceNormal), -viewDir), 0.0), 16.0);

    // Colors: Pure Liquid Chrome (Silver/White)
    vec3 darkBase = vec3(0.2, 0.2, 0.25); // Brighter grey base (was 0.1)
    vec3 brightChrome = vec3(1.0, 1.0, 1.0); // Pure White
    
    // Environment Reflection Simulation (Fake Refmap)
    // Map normal to a "sky/ground" mix
    float reflection = smoothstep(-0.4, 0.6, faceNormal.y); // Wider reflection range
    vec3 envColor = mix(darkBase, brightChrome, reflection);
    
    // Combine
    vec3 color = envColor;
    
    // Add sharp speculars (Plastic/Glassy coating over metal)
    color += vec3(1.0) * spec1 * 1.5;
    color += vec3(0.8, 0.9, 1.0) * spec2;
    
    // Add Fresnel Rim (Glowing Edge)
    color += vec3(0.5, 0.7, 1.0) * fresnel * 0.5;

    gl_FragColor = vec4(color, uOpacity);
  }
`;
