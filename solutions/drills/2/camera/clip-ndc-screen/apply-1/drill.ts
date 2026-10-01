// Reference answer for drills/2/camera/clip-ndc-screen/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function pixelToNdc(x: number, y: number, width: number, height: number): Answer<THREE.Vector3> {
  return new THREE.Vector3(2*x/width-1,1-2*y/height,0);
}
