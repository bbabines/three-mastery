// Reference answer for drills/2/camera/project-unproject/implement-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function labelPosition(camera: THREE.Camera, worldPoint: THREE.Vector3, width: number, height: number): Answer<THREE.Vector3> {
  camera.updateWorldMatrix(true,false);
  const ndc=worldPoint.clone().project(camera);
  return new THREE.Vector3((ndc.x+1)*width/2,(1-ndc.y)*height/2,ndc.z);
}
