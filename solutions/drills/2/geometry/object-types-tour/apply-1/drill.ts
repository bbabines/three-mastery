// Reference answer for drills/2/geometry/object-types-tour/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function makeRepeatedParts(geometry: THREE.BufferGeometry, material: THREE.Material, count: number): Answer<THREE.InstancedMesh> {
  const mesh=new THREE.InstancedMesh(geometry,material,count);
  for(let i=0;i<count;i++) mesh.setMatrixAt(i,new THREE.Matrix4().makeTranslation(i,0,0));
  mesh.instanceMatrix.needsUpdate=true;
  return mesh;
}
