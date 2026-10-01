// Reference answer for drills/2/transforms/object3d-tour/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function keepWorldOnAttach(part: THREE.Object3D, newParent: THREE.Object3D): Answer<THREE.Vector3> {
  newParent.attach(part);
  return part.getWorldPosition(new THREE.Vector3());
}
