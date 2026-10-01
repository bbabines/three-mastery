// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function cameraRight(camera: THREE.Camera): THREE.Vector3 {
  const forward=camera.getWorldDirection(new THREE.Vector3());
  if (Math.abs(forward.dot(camera.up)) > 0.99) return new THREE.Vector3();
  return new THREE.Vector3().crossVectors(forward,camera.up).normalize();
}
