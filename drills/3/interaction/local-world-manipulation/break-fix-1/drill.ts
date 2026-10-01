// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function moveByWorld(part: THREE.Object3D, worldDelta: THREE.Vector3): THREE.Vector3 {
  part.position.add(worldDelta); return part.getWorldPosition(new THREE.Vector3());
}
