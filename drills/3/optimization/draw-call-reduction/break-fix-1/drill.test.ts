import { describe, expect, it } from 'vitest';
import { BoxGeometry, Matrix4, MeshBasicMaterial, InstancedMesh } from 'three';
import { buildCutoutRack } from './drill';
describe('cutout rack',()=>{
 it('keeps repeats in one draw and rejects blended hidden layers',()=>{
  const geometry=new BoxGeometry(), material=new MeshBasicMaterial({transparent:true,depthWrite:false});
  const transforms=[0,2,4,6].map(x=>new Matrix4().makeTranslation(x,0,0));
  const rack=buildCutoutRack(geometry,material,transforms);
  expect(rack).toBeInstanceOf(InstancedMesh); expect(rack.count).toBe(transforms.length);
  transforms.forEach((m,i)=>expect(rack.getMatrixAt(i,new Matrix4()).elements).toEqual(m.elements));
  expect(material.transparent).toBe(false); expect(material.depthWrite).toBe(true); expect(material.alphaTest).toBeGreaterThan(0);
  geometry.dispose();material.dispose();
 });
});
