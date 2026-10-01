import type { Answer } from '@harness/drill';
import { ShaderMaterial, Vector2 } from 'three';
export function screenGradient(resolution: Vector2): Answer<ShaderMaterial> {
 return new ShaderMaterial({
  uniforms: { uResolution: { value: resolution.clone() } },
  vertexShader: `void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `uniform vec2 uResolution;
void main() { gl_FragColor = vec4(gl_FragCoord.x/uResolution.x,0.0,0.0,1.0); }`,
 });
}
