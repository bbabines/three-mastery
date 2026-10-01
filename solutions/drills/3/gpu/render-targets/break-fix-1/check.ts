import * as THREE from 'three';
import { expect } from 'vitest';
import type { captureThumbnail } from './drill';

export function checkRenderTargets(subject: typeof captureThumbnail): void {
  const target=new THREE.WebGLRenderTarget(32,32), calls:string[]=[]; const fake={setRenderTarget:(t:THREE.WebGLRenderTarget|null)=>calls.push(t?"target":"canvas"),render:()=>calls.push("render")}; subject(fake,new THREE.Scene(),new THREE.Camera(),target); expect(calls).toEqual(["target","render","canvas"]);
}
