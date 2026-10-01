// Reference answer for drills/2/camera/project-unproject/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function pointAtNdcDepth(camera: THREE.Camera, x: number, y: number, depth: number): Answer<THREE.Vector3> {
  camera.updateWorldMatrix(true,false);
  return new THREE.Vector3(x,y,depth).unproject(camera);
}
