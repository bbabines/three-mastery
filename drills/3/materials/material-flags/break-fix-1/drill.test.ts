import { describe, expect, it } from 'vitest';
import {FrontSide,Texture} from 'three';
import { perforatedPanel } from './drill';
describe('perforatedPanel',()=>{
 it('repairs the visible behavior across inputs',()=>{
 const mask=new Texture(),m=perforatedPanel(mask);expect(m.alphaMap).toBe(mask);expect(m.side).toBe(FrontSide);expect(m.alphaTest).toBeGreaterThan(0);expect(m.transparent).toBe(false);expect(m.depthWrite).toBe(true);
 });
});
