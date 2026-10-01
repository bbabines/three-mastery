import type { Answer } from '@harness/drill';
import { MeshStandardMaterial } from 'three';
export function injectEmissivePulse(material: MeshStandardMaterial, strength: number): Answer<MeshStandardMaterial> {
 material.onBeforeCompile = (shader) => {
  shader.uniforms.uPulse = { value: strength };
  shader.fragmentShader = shader.fragmentShader
   .replace('#include <common>', '#include <common>\nuniform float uPulse;')
   .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(uPulse);');
 };
 material.needsUpdate = true;
 return material;
}
