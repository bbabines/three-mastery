// Reference repair for drills/3/interaction/local-world-manipulation/break-fix-1.
import * as THREE from 'three';

export function moveByWorld(part: THREE.Object3D, worldDelta: THREE.Vector3): THREE.Vector3 {
  const world=part.getWorldPosition(new THREE.Vector3()).add(worldDelta); part.position.copy(part.parent?part.parent.worldToLocal(world):world); return part.getWorldPosition(new THREE.Vector3());
}
