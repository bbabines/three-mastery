import {ShaderMaterial,Vector3} from 'three';
export function uvGradient():ShaderMaterial {
 return new ShaderMaterial({
  uniforms: {},
  vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  fragmentShader: `varying vec2 vUv; void main(){float red=step(0.5,vUv.x);gl_FragColor=vec4(red,0.0,0.0,1.0);}`,
 });
}
