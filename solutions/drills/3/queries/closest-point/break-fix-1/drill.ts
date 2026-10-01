// Reference repair for drills/3/queries/closest-point/break-fix-1.
import * as THREE from 'three';

export function segmentSnap(point: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3): THREE.Vector3 {
  return new THREE.Line3(a,b).closestPointToPoint(point,true,new THREE.Vector3());
}
