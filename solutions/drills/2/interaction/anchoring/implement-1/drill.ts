// Anchor: place an HTML label. Write the functions, save, and run: npm run drill -- drills/2/interaction/anchoring/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// CSS position and visibility for a projected world point.
export function labelPosition(world: THREE.Vector3, camera: THREE.Camera, rect: { left: number; top: number; width: number; height: number }): Answer<{ x: number; y: number; visible: boolean }> {
  camera.updateMatrixWorld();
  const ndc = world.clone().project(camera);
  const toPoint = world.clone().sub(camera.getWorldPosition(new THREE.Vector3()));
  const forward = new THREE.Vector3(0,0,-1).applyQuaternion(camera.getWorldQuaternion(new THREE.Quaternion()));
  return { x: rect.left + (ndc.x+1)*rect.width/2, y: rect.top + (1-ndc.y)*rect.height/2, visible: toPoint.dot(forward)>0 && Math.abs(ndc.x)<=1 && Math.abs(ndc.y)<=1 && ndc.z>=-1 && ndc.z<=1 };
}
