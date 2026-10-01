import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { captureThumbnail } from './drill';

describe('gpu.render-targets', () => {
  it('repairs the reported symptom for a general case', () => {
    const target=new THREE.WebGLRenderTarget(64,64), calls:string[]=[]; const fake={setRenderTarget:(t:THREE.WebGLRenderTarget|null)=>calls.push(t?"offscreen":"screen"),render:()=>calls.push("draw")}; captureThumbnail(fake,new THREE.Scene(),new THREE.Camera(),target); expect(calls).toEqual(["offscreen","draw","screen"]);
  });
});
