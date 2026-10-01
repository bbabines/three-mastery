import {Material,MeshStandardMaterial,ShaderMaterial} from 'three';
export function addPulse(base:MeshStandardMaterial,strength:number):Material {
 return new ShaderMaterial({
  vertexShader:'void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader:`void main(){gl_FragColor=vec4(vec3(${strength.toFixed(1)}),1.0);}`,
 });
}
