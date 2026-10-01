// Reference answer for drills/2/camera/clip-ndc-screen/implement-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function ndcToPixel(ndc: THREE.Vector3, width: number, height: number): Answer<THREE.Vector3> {
  return new THREE.Vector3((ndc.x+1)*width/2,(1-ndc.y)*height/2,ndc.z);
}
