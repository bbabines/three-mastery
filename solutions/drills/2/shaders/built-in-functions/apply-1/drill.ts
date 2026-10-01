import type { Answer } from '@harness/drill';
import { ShaderMaterial, Vector2 } from 'three';
export function radialFalloff(): Answer<ShaderMaterial> {
 return new ShaderMaterial({
  uniforms: {},
  vertexShader: `varying vec2 vUv;
void main() { vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
  fragmentShader: `varying vec2 vUv;
void main() { float t=clamp(length(vUv-vec2(.5))*2.0,0.0,1.0); vec3 color=mix(vec3(1.0,.4,.1),vec3(.1,.2,1.0),t); gl_FragColor=vec4(color,1.0); }`,
 });
}
