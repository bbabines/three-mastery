import type { Answer } from '@harness/drill';
import { ShaderMaterial, Vector2 } from 'three';
export function softRing(radius: number, edge: number): Answer<ShaderMaterial> {
 return new ShaderMaterial({
  uniforms: { uRadius: { value: radius }, uEdge: { value: edge } },
  vertexShader: `varying vec2 vUv;
void main() { vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
  fragmentShader: `varying vec2 vUv; uniform float uRadius; uniform float uEdge;
void main() { float d=length(vUv-vec2(.5)); float ring=smoothstep(uRadius-uEdge,uRadius,d)-smoothstep(uRadius,uRadius+uEdge,d); gl_FragColor=vec4(vec3(ring),1.0); }`,
 });
}
