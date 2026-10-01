// Reference repair for drills/3/interaction/orbit-pan-dolly/break-fix-1.
import * as THREE from 'three';

export function focusView(camera: THREE.Camera, orbit: {target:THREE.Vector3}, center: THREE.Vector3, distance: number): boolean {
  const forward=camera.getWorldDirection(new THREE.Vector3()); camera.position.copy(center).addScaledVector(forward,-distance); orbit.target.copy(center); return true;
}
