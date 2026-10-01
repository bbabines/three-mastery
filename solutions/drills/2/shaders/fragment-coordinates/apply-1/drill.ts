import type { Answer } from '@harness/drill';
import { ShaderMaterial } from 'three';
export function cssChecker(dpr: number): Answer<ShaderMaterial> {
 return new ShaderMaterial({
  uniforms: { uDpr: { value: dpr } },
  vertexShader: `void main() { gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
  fragmentShader: `uniform float uDpr;
void main() { vec2 css=gl_FragCoord.xy/uDpr; float cell=mod(floor(css.x/8.0)+floor(css.y/8.0),2.0); gl_FragColor=vec4(vec3(cell),1.0); }`,
 });
}
