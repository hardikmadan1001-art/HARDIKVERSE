import * as THREE from 'three';

export const FabricMaterial = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;

    void main() {
      vUv = uv;
      vPosition = position;

      vec3 pos = position;

      // Simulate fabric folds and waving
      // We use a combination of sine waves to create organic, overlapping folds
      float wave = sin(pos.x * 3.0 + uTime * 1.5) * 0.05;
      wave += sin(pos.y * 5.0 + uTime * 2.0) * 0.03;
      wave += sin((pos.x + pos.y) * 2.0 + uTime * 1.0) * 0.02;

      // Add some "hanging" weight - more movement at the bottom than the top
      float weight = 1.0 - (pos.y + 0.5); // Assuming geometry centered at 0
      pos.z += wave * weight;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform sampler2D uTexture;
    uniform float uTime;

    void main() {
      vec4 color = texture2D(uTexture, vUv);

      // Calculate simple fake lighting based on the "folds"
      // In a real vertex shader we'd pass normals, but for a simple effect
      // we can approximate shading based on the wave patterns
      float shading = 1.0;
      float wave = sin(vPosition.x * 3.0 + uTime * 1.5) * 0.5 + 0.5;
      shading = 0.8 + 0.2 * wave;

      gl_FragColor = vec4(color.rgb * shading, color.a);
    }
  `
};
