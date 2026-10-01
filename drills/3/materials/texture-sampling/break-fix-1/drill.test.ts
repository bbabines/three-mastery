import { describe, expect, it } from 'vitest';
import {LinearMipmapLinearFilter,Texture,RepeatWrapping} from 'three';
import { distantTile } from './drill';
describe('distantTile',()=>{
 it('repairs the visible behavior across inputs',()=>{
 const t=new Texture();t.wrapS=RepeatWrapping;expect(distantTile(t)).toBe(t);expect(t.generateMipmaps).toBe(true);expect(t.minFilter).toBe(LinearMipmapLinearFilter);expect(t.wrapS).toBe(RepeatWrapping);
 });
});
