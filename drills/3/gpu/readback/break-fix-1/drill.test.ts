import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { pickPixel } from './drill';

describe('gpu.readback', () => {
  it('repairs the reported symptom for a general case', async () => {
    let sync=0,async=0; const fake={readRenderTargetPixels:()=>{sync++;},readRenderTargetPixelsAsync:async(_t:THREE.WebGLRenderTarget,_x:number,_y:number,w:number,h:number,b:Uint8Array)=>{async++; expect([w,h]).toEqual([1,1]); b.set([4,5,6,255]); return b;}}; const out=await pickPixel(fake,new THREE.WebGLRenderTarget(10,10),2,3); expect(Array.from(out)).toEqual([4,5,6,255]); expect([sync,async]).toEqual([0,1]);
  });
});
