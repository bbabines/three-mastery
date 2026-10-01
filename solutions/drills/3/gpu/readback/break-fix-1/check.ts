import * as THREE from 'three';
import { expect } from 'vitest';
import type { pickPixel } from './drill';

export function checkReadback(subject: typeof pickPixel): Promise<void> {
  return (async () => { let sync=0,async=0; const fake={readRenderTargetPixels:()=>{sync++;},readRenderTargetPixelsAsync:async(_t:THREE.WebGLRenderTarget,_x:number,_y:number,_w:number,_h:number,b:Uint8Array)=>{async++; return b;}}; await subject(fake,new THREE.WebGLRenderTarget(8,8),1,1); expect([sync,async]).toEqual([0,1]); })();
}
