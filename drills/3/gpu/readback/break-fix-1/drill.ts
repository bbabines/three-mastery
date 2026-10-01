// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function pickPixel(renderer: {readRenderTargetPixelsAsync:(target:THREE.WebGLRenderTarget,x:number,y:number,w:number,h:number,buffer:Uint8Array)=>Promise<Uint8Array>;readRenderTargetPixels:(target:THREE.WebGLRenderTarget,x:number,y:number,w:number,h:number,buffer:Uint8Array)=>void}, target: THREE.WebGLRenderTarget, x: number, y: number): Promise<Uint8Array> {
  const data=new Uint8Array(4); renderer.readRenderTargetPixels(target,x,y,1,1,data); return Promise.resolve(data);
}
