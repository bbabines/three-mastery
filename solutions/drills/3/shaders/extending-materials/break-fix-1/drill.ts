import {Material,MeshStandardMaterial,ShaderMaterial} from 'three';
export function addPulse(base:MeshStandardMaterial,strength:number):Material {
 base.onBeforeCompile=(shader)=>{
  shader.uniforms.uPulse={value:strength};
  shader.fragmentShader=shader.fragmentShader
   .replace('#include <common>','#include <common>\nuniform float uPulse;')
   .replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(uPulse);');
 };
 base.needsUpdate=true;
 return base;
}
