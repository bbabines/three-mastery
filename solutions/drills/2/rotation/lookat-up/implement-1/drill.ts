// Reference answer for drills/2/rotation/lookat-up/implement-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function aimWithUp(from: THREE.Vector3, target: THREE.Vector3, up: THREE.Vector3): Answer<THREE.Quaternion> {
  const object=new THREE.Object3D(); object.position.copy(from); object.up.copy(up); object.lookAt(target); return object.quaternion.clone();
}
