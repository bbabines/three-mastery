import type { Answer } from '@harness/drill';
import { ShaderMaterial, Vector2 } from 'three';
export function barycentricWire(): Answer<ShaderMaterial> {
 return new ShaderMaterial({
  uniforms: {},
  vertexShader: `attribute vec3 barycentric; varying vec3 vBary;
void main() { vBary = barycentric; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `varying vec3 vBary;
void main() { float edge = min(vBary.x, min(vBary.y, vBary.z)); gl_FragColor = vec4(vec3(1.0-step(0.03,edge)),1.0); }`,
 });
}
