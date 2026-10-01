// Reference repair for drills/3/geometry/indexed/break-fix-1.
import * as THREE from 'three';

export function triangleAt(geometry: THREE.BufferGeometry, triangleIndex: number): [THREE.Vector3, THREE.Vector3, THREE.Vector3] {
  const p=geometry.getAttribute('position'); return [0,1,2].map(n=>new THREE.Vector3().fromBufferAttribute(p,geometry.index?.getX(3*triangleIndex+n)??3*triangleIndex+n)) as [THREE.Vector3,THREE.Vector3,THREE.Vector3];
}
