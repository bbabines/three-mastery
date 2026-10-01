import { expect } from 'vitest';
import { PlaneGeometry, Matrix4, MeshBasicMaterial } from 'three';
import type { buildCutoutRack } from './drill';
export function checkCutoutRack(build: typeof buildCutoutRack): void {
 const geometry=new PlaneGeometry(), material=new MeshBasicMaterial({transparent:true,depthWrite:false});
 const rack=build(geometry,material,[new Matrix4(),new Matrix4().makeTranslation(1,0,0)]);
 expect(rack.count).toBe(2); expect(material.transparent).toBe(false);
 expect(material.depthWrite).toBe(true); expect(material.alphaTest).toBeGreaterThan(0);
 geometry.dispose();material.dispose();
}
