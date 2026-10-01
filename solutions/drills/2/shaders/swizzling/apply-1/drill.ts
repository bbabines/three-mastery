import type { Answer } from '@harness/drill';
import { ShaderMaterial } from 'three';
export function zUpToYUp(): Answer<ShaderMaterial> {
 return new ShaderMaterial({
  uniforms: {},
  vertexShader: `void main() { vec3 yUp=vec3(position.x,position.z,-position.y); gl_Position=projectionMatrix*modelViewMatrix*vec4(yUp,1.0); }`,
  fragmentShader: `void main() { gl_FragColor=vec4(1.0,0.5,0.1,1.0); }`,
 });
}
