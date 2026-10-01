import { describe, expect, it } from 'vitest';
import {MeshStandardMaterial,Texture} from 'three';
import { attachCreviceAo } from './drill';
describe('attachCreviceAo',()=>{
 it('repairs the visible behavior across inputs',()=>{
 const m=new MeshStandardMaterial(),ao=new Texture();expect(attachCreviceAo(m,ao)).toBe(m);expect(m.aoMap).toBe(ao);expect(ao.channel).toBe(1);
 });
});
