import {ShaderMaterial,Vector3} from 'three';
export function softRing():ShaderMaterial {
 return new ShaderMaterial({
  uniforms: {},
  vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  fragmentShader: `varying vec2 vUv;void main(){float d=abs(length(vUv-vec2(.5))-.25);float a=1.0-smoothstep(.02,.05,d);gl_FragColor=vec4(vec3(a),1.0);}`,
 });
}
