import {ShaderMaterial,Vector3} from 'three';
export function uvGradient():ShaderMaterial {
 return new ShaderMaterial({
  uniforms: {},
  vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  fragmentShader: `varying vec2 vUv; void main(){gl_FragColor=vec4(vUv.x,0.0,0.0,1.0);}`,
 });
}
