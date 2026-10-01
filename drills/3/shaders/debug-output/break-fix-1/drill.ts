import {ShaderMaterial,Vector3} from 'three';
export function normalDebug(normal:Vector3):ShaderMaterial {
 return new ShaderMaterial({
  uniforms: {uNormal:{value:normal.clone()}},
  vertexShader: `void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  fragmentShader: `uniform vec3 uNormal;void main(){gl_FragColor=vec4(normalize(uNormal),1.0);}`,
 });
}
