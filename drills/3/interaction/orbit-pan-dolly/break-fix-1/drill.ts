// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function focusView(camera: THREE.Camera, orbit: {target:THREE.Vector3}, center: THREE.Vector3, distance: number): boolean {
  const forward=camera.getWorldDirection(new THREE.Vector3()); camera.position.copy(center).addScaledVector(forward,-distance); return true;
}
