import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { pickPixel } from './drill';

describe('gpu.readback', () => {
  it('reads one ID pixel asynchronously at the requested target coordinates', async () => {
    let sync=0,async=0; const target=new THREE.WebGLRenderTarget(10,10);
    const fake={readRenderTargetPixels:()=>{sync++;},readRenderTargetPixelsAsync:async(t:THREE.WebGLRenderTarget,x:number,y:number,w:number,h:number,b:Uint8Array)=>{async++; expect(t).toBe(target); expect([x,y,w,h,b.length]).toEqual([2,3,1,1,4]); b.set([4,5,6,255]); return b;}};
    const out=await pickPixel(fake,target,2,3); expect(Array.from(out)).toEqual([4,5,6,255]); expect([sync,async]).toEqual([0,1]);
  });
});
