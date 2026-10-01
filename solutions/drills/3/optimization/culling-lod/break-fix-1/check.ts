import { expect } from 'vitest';
import { BoxGeometry, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, PerspectiveCamera } from 'three';
import type { configurePart } from './drill';
export function checkFarPart(configure: typeof configurePart):void{
 const camera=new PerspectiveCamera(60,1,0.1,200);camera.position.set(0,0,6);camera.lookAt(0,0,0);
 const high=new MeshPhysicalMaterial({transmission:1}),low=new MeshStandardMaterial();
 const part=new Mesh(new BoxGeometry(),high);part.position.z=-30;
 expect(configure(part,camera,high,low,15)).toBe('far');expect(part.material).toBe(low);
 part.position.set(0,0,0);expect(configure(part,camera,high,low,15)).toBe('near');expect(part.material).toBe(high);
 part.geometry.dispose();high.dispose();low.dispose();
}
