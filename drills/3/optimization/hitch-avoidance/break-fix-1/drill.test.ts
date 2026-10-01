import { describe, expect, it } from 'vitest';
import { PerspectiveCamera, Scene, Texture } from 'three';
import { revealVariant } from './drill';
describe('variant reveal',()=>{
 it('uploads and compiles before the first visible frame',async()=>{
  const events:string[]=[];let release:()=>void=()=>{};
  const gate=new Promise<void>(resolve=>{release=resolve;});
  const scene=new Scene(),camera=new PerspectiveCamera(),texture=new Texture();
  const pending=revealVariant({initTexture:t=>{expect(t).toBe(texture);events.push('upload');},compileAsync:async(s,c)=>{expect(s).toBe(scene);expect(c).toBe(camera);events.push('compile');await gate;}},scene,camera,texture,()=>events.push('show'));
  expect(events).toEqual(['upload','compile']);release();await pending;expect(events).toEqual(['upload','compile','show']);texture.dispose();
 });
});
