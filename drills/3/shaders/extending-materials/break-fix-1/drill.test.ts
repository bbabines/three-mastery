import {MeshStandardMaterial,Texture,type WebGLRenderer} from 'three';
import {describe,expect,it} from 'vitest';
import {addPulse} from './drill';
describe('addPulse',()=>{
 it('keeps Standard lighting and existing maps',()=>{
  const normal=new Texture(),base=new MeshStandardMaterial({normalMap:normal,color:'#507090'});
  const result=addPulse(base,.3);expect(result).toBe(base);expect(base.normalMap).toBe(normal);
  const shader={uniforms:{},fragmentShader:'#include <common>\n#include <emissivemap_fragment>'} as Parameters<MeshStandardMaterial['onBeforeCompile']>[0];
  base.onBeforeCompile(shader,{} as WebGLRenderer);
  expect(shader.uniforms.uPulse.value).toBe(.3);
  expect(shader.fragmentShader).toContain('totalEmissiveRadiance += vec3(uPulse)');
 });
 it('accepts a different pulse without losing material identity',()=>{const base=new MeshStandardMaterial();expect(addPulse(base,.7)).toBe(base);});
});
