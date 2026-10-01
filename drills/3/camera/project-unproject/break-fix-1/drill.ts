// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function labelVisible(camera: THREE.Camera, worldPoint: THREE.Vector3): boolean {
  camera.updateWorldMatrix(true,false); const ndc=worldPoint.clone().project(camera); return Math.abs(ndc.x)<=1 && Math.abs(ndc.y)<=1;
}
