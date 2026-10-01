// Reference answer for drills/2/geometry/face-normals/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function flatFaceToward(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, worldView: THREE.Vector3): Answer<boolean> {
  return THREE.Triangle.getNormal(a,b,c,new THREE.Vector3()).dot(worldView)>0;
}
