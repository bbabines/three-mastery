import type { Answer } from '@harness/drill';
import { ShaderMaterial } from 'three';
export function circleMask(): Answer<ShaderMaterial> {
 return new ShaderMaterial({
  uniforms: {},
  vertexShader: `varying vec2 vUv;
void main() { vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
  fragmentShader: `varying vec2 vUv;
void main() { if(length(vUv-vec2(.5))>0.4) discard; gl_FragColor=vec4(0.2,0.8,0.6,1.0); }`,
 });
}
