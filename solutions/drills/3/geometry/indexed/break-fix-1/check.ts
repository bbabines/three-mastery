import * as THREE from 'three';
import { expect } from 'vitest';
import type { triangleAt } from './drill';

export function checkIndexed(subject: typeof triangleAt): void {
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0, 3,0,0, 3,3,0, 0,3,0, -1,1,0],3)); g.setIndex([0,1,2,4,2,3]);
  const got=subject(g,1), ids=[4,2,3]; got.forEach((v,i)=>expect(v.distanceTo(new THREE.Vector3().fromBufferAttribute(g.getAttribute('position'),ids[i]))).toBeLessThan(1e-6));
}
