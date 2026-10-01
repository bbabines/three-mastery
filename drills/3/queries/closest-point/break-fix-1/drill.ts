// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function segmentSnap(point: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3): THREE.Vector3 {
  return new THREE.Line3(a,b).closestPointToPoint(point,false,new THREE.Vector3());
}
