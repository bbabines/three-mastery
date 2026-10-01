import { describe, expect, it } from 'vitest';
import {DirectionalLight} from 'three';
import { fitProductShadow } from './drill';
describe('fitProductShadow',()=>{
 it('repairs the visible behavior across inputs',()=>{
 const a=new DirectionalLight();expect(fitProductShadow(a,4)).toBe(a);expect([a.shadow.camera.left,a.shadow.camera.right,a.shadow.camera.top,a.shadow.camera.bottom]).toEqual([-2,2,2,-2]);const b=new DirectionalLight();fitProductShadow(b,1);expect(b.shadow.camera.right-b.shadow.camera.left).toBe(1);expect(b.shadow.mapSize.x).toBeLessThan(4096);
 });
});
