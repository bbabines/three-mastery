// Reference repair for drills/3/interaction/drag-on-plane/break-fix-1.
import * as THREE from 'three';

export function dragPosition(hit: THREE.Vector3, grabOffset: THREE.Vector3): THREE.Vector3 {
  return hit.clone().add(grabOffset);
}
