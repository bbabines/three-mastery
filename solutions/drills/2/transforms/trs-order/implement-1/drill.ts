// Reference answer for drills/2/transforms/trs-order/implement-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function placeVertex(vertex: THREE.Vector3, position: THREE.Vector3, rotation: THREE.Quaternion, scale: THREE.Vector3): Answer<THREE.Vector3> {
  return vertex.clone().applyMatrix4(new THREE.Matrix4().compose(position, rotation, scale));
}
