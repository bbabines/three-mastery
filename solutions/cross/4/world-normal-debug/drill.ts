import type { Answer } from '@harness/drill';
import { GLSL3, ShaderMaterial } from 'three';

export function worldNormalMaterial(): Answer<ShaderMaterial> {
  return new ShaderMaterial({
    glslVersion: GLSL3,
    vertexShader: `out vec3 vWorldNormal;
void main() {
  mat3 worldNormalMatrix = transpose(inverse(mat3(modelMatrix)));
  vWorldNormal = normalize(worldNormalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,
    fragmentShader: `in vec3 vWorldNormal;
out vec4 outColor;
void main() { outColor = vec4(normalize(vWorldNormal) * 0.5 + 0.5, 1.0); }`,
  });
}
