import * as THREE from 'three';
import { expect } from 'vitest';
import type { flipFrontFace } from './drill';

export function checkWindingOrder(subject: typeof flipFrontFace): void {
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,2,0,0,0,2,0],3)); g.setIndex([0,1,2]); g.computeVertexNormals();
  const f=subject(g); const p=f.getAttribute('position'); const n=THREE.Triangle.getNormal(...([0,1,2].map(i=>new THREE.Vector3().fromBufferAttribute(p,i)) as [THREE.Vector3,THREE.Vector3,THREE.Vector3]),new THREE.Vector3());
  expect(n.z).toBeLessThan(0); expect(g.index).not.toBeNull();
}
