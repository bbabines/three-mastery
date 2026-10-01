import { describe, expect, it } from 'vitest';
import {MeshStandardMaterial,Scene,Texture} from 'three';
import { chromeStage } from './drill';
describe('chromeStage',()=>{
 it('repairs the visible behavior across inputs',()=>{
 const s=new Scene(),m=new MeshStandardMaterial(),light=new Texture(),back=new Texture();expect(chromeStage(s,m,light,back)).toBe(s);expect(s.environment).toBe(light);expect(s.background).toBe(back);expect(m.metalness).toBe(1);
 });
});
