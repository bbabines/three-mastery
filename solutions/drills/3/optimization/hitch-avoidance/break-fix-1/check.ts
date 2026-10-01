import { expect } from 'vitest';
import { PerspectiveCamera, Scene, Texture } from 'three';
import type { revealVariant } from './drill';
export async function checkPreparedReveal(reveal:typeof revealVariant):Promise<void>{
 const events:string[]=[];let release:()=>void=()=>{};const gate=new Promise<void>(resolve=>{release=resolve;});
 const texture=new Texture();const pending=reveal({initTexture:()=>events.push('upload'),compileAsync:async()=>{events.push('compile');await gate;}},new Scene(),new PerspectiveCamera(),texture,()=>events.push('show'));
 expect(events).toEqual(['upload','compile']);release();await pending;expect(events).toEqual(['upload','compile','show']);texture.dispose();
}
