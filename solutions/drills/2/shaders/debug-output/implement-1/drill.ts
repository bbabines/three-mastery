import type { Answer } from '@harness/drill';
import { ShaderMaterial, Vector2 } from 'three';
export function uvDebug(): Answer<ShaderMaterial> {
 return new ShaderMaterial({
  uniforms: {},
  vertexShader: `varying vec2 vUv;
void main() { vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
  fragmentShader: `varying vec2 vUv;
void main() { gl_FragColor=vec4(fract(vUv.x*4.0),fract(vUv.y*4.0),0.0,1.0); }`,
 });
}
