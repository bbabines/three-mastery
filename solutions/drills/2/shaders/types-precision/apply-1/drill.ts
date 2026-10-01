import type { Answer } from '@harness/drill';
import { ShaderMaterial } from 'three';
export function farOriginGradient(origin: number): Answer<ShaderMaterial> {
 return new ShaderMaterial({
  uniforms: { uOrigin: { value: origin } },
  vertexShader: `precision highp float; uniform float uOrigin; varying float vLocal;
void main() { vLocal=position.x; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
  fragmentShader: `precision highp float; varying float vLocal; uniform float uOrigin;
void main() { float value=fract((uOrigin+vLocal)*0.001); gl_FragColor=vec4(vec3(value),1.0); }`,
 });
}
