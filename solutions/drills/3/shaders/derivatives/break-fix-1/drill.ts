import {ShaderMaterial} from 'three';
export function gridShader():ShaderMaterial {
 return new ShaderMaterial({
  vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  fragmentShader: `varying vec2 vUv;void main(){vec2 grid=fract(vUv*8.0);vec2 width=fwidth(vUv*8.0);vec2 line=1.0-smoothstep(vec2(0.0),width,grid);float mask=max(line.x,line.y);gl_FragColor=vec4(vec3(mask),1.0);}`,
 });
}
