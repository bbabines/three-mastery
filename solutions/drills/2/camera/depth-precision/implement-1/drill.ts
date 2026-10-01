// Reference answer for drills/2/camera/depth-precision/implement-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function depthAt(camera: THREE.PerspectiveCamera, viewDepth: number): Answer<number> {
  return (new THREE.Vector3(0,0,-viewDepth).applyMatrix4(camera.projectionMatrix).z+1)/2;
}
