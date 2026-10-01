// Reference answer for drills/2/geometry/indexed/implement-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function triangleVertices(geometry: THREE.BufferGeometry, triangleIndex: number): Answer<[THREE.Vector3, THREE.Vector3, THREE.Vector3]> {
  const position=geometry.getAttribute('position');
  const corner=(i:number)=>{ const n=geometry.index?.getX(i) ?? i; return new THREE.Vector3().fromBufferAttribute(position,n); };
  return [corner(3*triangleIndex),corner(3*triangleIndex+1),corner(3*triangleIndex+2)];
}
