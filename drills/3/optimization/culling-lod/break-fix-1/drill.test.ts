import { describe, expect, it } from 'vitest';
import { BoxGeometry, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, PerspectiveCamera } from 'three';
import { configurePart } from './drill';
describe('part cost',()=>{
 it('culls whole objects then uses a cheaper material at distance',()=>{
  const camera=new PerspectiveCamera(60,1,0.1,100);camera.position.z=5;camera.lookAt(0,0,0);
  const high=new MeshPhysicalMaterial({transmission:1}),low=new MeshStandardMaterial();
  const near=new Mesh(new BoxGeometry(),high);expect(configurePart(near,camera,high,low,12)).toBe('near');expect(near.material).toBe(high);
  const distant=new Mesh(new BoxGeometry(),high);distant.position.z=-20;
  expect(configurePart(distant,camera,high,low,12)).toBe('far');expect(distant.material).toBe(low);
  distant.position.x=300;expect(configurePart(distant,camera,high,low,12)).toBe('culled');expect(distant.visible).toBe(false);
  near.geometry.dispose();distant.geometry.dispose();high.dispose();low.dispose();
 });
});
