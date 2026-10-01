// Anchor: hide an occluded price tag. Write the functions, save, and run: npm run drill -- drills/2/interaction/anchoring/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// Whether the label can be seen from the camera.
export function labelUnoccluded(world: THREE.Vector3, camera: THREE.Camera, blockers: THREE.Object3D[]): Answer<boolean> {
  camera.updateMatrixWorld();
  const origin = camera.getWorldPosition(new THREE.Vector3());
  const toPoint = world.clone().sub(origin); const distance = toPoint.length();
  const forward = new THREE.Vector3(0,0,-1).applyQuaternion(camera.getWorldQuaternion(new THREE.Quaternion()));
  if (toPoint.dot(forward)<=0) return false;
  const caster = new THREE.Raycaster(origin,toPoint.normalize(),0,distance-1e-4);
  return caster.intersectObjects(blockers,true).length===0;
}
