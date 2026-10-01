import {expect} from 'vitest';import {MeshStandardMaterial,Texture,type WebGLRenderer} from 'three';import type {addPulse} from './drill';
export function checkRepair(repair:typeof addPulse):void {
 const normal=new Texture(),base=new MeshStandardMaterial({normalMap:normal});
 expect(repair(base,.4)).toBe(base);expect(base.normalMap).toBe(normal);
 const shader={uniforms:{},fragmentShader:'#include <common>\n#include <emissivemap_fragment>'} as Parameters<MeshStandardMaterial['onBeforeCompile']>[0];
 base.onBeforeCompile(shader,{} as WebGLRenderer);expect(shader.uniforms.uPulse.value).toBe(.4);
}
