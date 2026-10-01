import type { Answer } from '@harness/drill';
import { ShaderMaterial, Vector2 } from 'three';
export function viewRim(): Answer<ShaderMaterial> {
 return new ShaderMaterial({
  uniforms: {},
  vertexShader: `varying vec3 vViewNormal;
void main() { vViewNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `varying vec3 vViewNormal;
void main() { float rim = 1.0 - abs(normalize(vViewNormal).z); gl_FragColor = vec4(vec3(rim),1.0); }`,
 });
}
