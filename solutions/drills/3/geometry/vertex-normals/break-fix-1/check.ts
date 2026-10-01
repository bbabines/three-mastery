import * as THREE from 'three';
import { expect } from 'vitest';
import type { flatNormals } from './drill';

export function checkVertexNormals(subject: typeof flatNormals): void {
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,2,0,0,0,2,0,0,0,2],3)); g.setIndex([0,1,2,0,3,1]);
  const flat=subject(g); expect(flat.index).toBeNull(); const n=flat.getAttribute('normal');
  const first=new THREE.Vector3().fromBufferAttribute(n,0), second=new THREE.Vector3().fromBufferAttribute(n,3);
  expect(first.angleTo(second)).toBeGreaterThan(0.1);
}
