import * as THREE from 'three';
import { expect } from 'vitest';
import type { pickPixel } from './drill';

export function checkReadback(subject: typeof pickPixel): Promise<void> {
  return (async () => { let sync=0,async=0; const target=new THREE.WebGLRenderTarget(8,8); const fake={readRenderTargetPixels:()=>{sync++;},readRenderTargetPixelsAsync:async(t:THREE.WebGLRenderTarget,x:number,y:number,w:number,h:number,b:Uint8Array)=>{async++; expect(t).toBe(target); expect([x,y,w,h,b.length]).toEqual([3,5,1,1,4]); b.set([7,2,9,255]); return b;}}; const got=await subject(fake,target,3,5); expect([sync,async]).toEqual([0,1]); expect(Array.from(got)).toEqual([7,2,9,255]); })();
}
