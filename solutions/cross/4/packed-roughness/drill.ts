import type { Answer } from '@harness/drill';
import { NoColorSpace, ShaderMaterial, Texture } from 'three';

export function roughnessDebug(packed: Texture): Answer<ShaderMaterial> {
  packed.colorSpace = NoColorSpace;
  return new ShaderMaterial({
    uniforms: { packedMap: { value: packed } },
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform sampler2D packedMap; varying vec2 vUv; void main() { float rough = texture2D(packedMap, vUv).g; gl_FragColor = vec4(vec3(rough), 1.0); }',
  });
}
