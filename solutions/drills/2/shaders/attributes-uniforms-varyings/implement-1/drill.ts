import type { Answer } from '@harness/drill';
import { ShaderMaterial, Vector2 } from 'three';
export function pulseUv(time: number): Answer<ShaderMaterial> {
 return new ShaderMaterial({
  uniforms: { uTime: { value: time } },
  vertexShader: `varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `uniform float uTime; varying vec2 vUv;
void main() { gl_FragColor = vec4(vUv.x * (0.5 + 0.5 * sin(uTime)), vUv.y, 0.0, 1.0); }`,
 });
}
