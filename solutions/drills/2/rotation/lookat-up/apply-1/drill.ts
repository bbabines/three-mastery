// Reference answer for drills/2/rotation/lookat-up/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function cameraAim(from: THREE.Vector3, target: THREE.Vector3, up: THREE.Vector3): Answer<THREE.Quaternion> {
  const camera=new THREE.PerspectiveCamera(); camera.position.copy(from); camera.up.copy(up); camera.lookAt(target); return camera.quaternion.clone();
}
