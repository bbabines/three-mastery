import type { Answer } from '@harness/drill';
import { ShaderMaterial, Vector2 } from 'three';
export function depthDebug(): Answer<ShaderMaterial> {
 return new ShaderMaterial({
  uniforms: {},
  vertexShader: `void main() { gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
  fragmentShader: `void main() { gl_FragColor=vec4(vec3(gl_FragCoord.z),1.0); }`,
 });
}
