// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function dragPosition(hit: THREE.Vector3, grabOffset: THREE.Vector3): THREE.Vector3 {
  return hit.clone();
}
